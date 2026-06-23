import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AcoesNegociacao from "../components/AcoesNegociacao";
import Chat from "../components/Chat";
import { useAuth } from "../context/AuthContext";
import { useNegociacao } from "../context/NegociacaoContext";
import { anuncioPath, negociacaoPath, ROUTES } from "../routes";
import { formatPreco, listAnuncios } from "../utils/anuncios";
import { itemGaragemFromAnuncio, moverItemGaragem, removerItemGaragem, sincronizarGaragemAnuncio } from "../utils/garagem";

export default function Negociacoes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, transferirVATs } = useAuth();
  const { propostas, aceitar, recusar, encerrar } = useNegociacao();
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    carregarAnuncios();
  }, []);

  function carregarAnuncios() {
    listAnuncios({ incluirInativos: true }).then(setAnuncios).catch(() => setAnuncios([]));
  }

  const anunciosPorId = useMemo(
    () => new Map(anuncios.map((anuncio) => [String(anuncio.id), anuncio])),
    [anuncios]
  );

  if (!usuario) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const minhasPropostas = propostas.filter(
    (proposta) =>
      String(proposta.compradorId) === String(usuario.id) ||
      String(proposta.vendedorId) === String(usuario.id)
  );

  const selecionada =
    minhasPropostas.find((proposta) => String(proposta.id) === String(id)) ??
    minhasPropostas[0];

  function abrirNegociacao(propostaId) {
    navigate(negociacaoPath(propostaId));
  }

  function handleAceitar(propostaId) {
    const proposta = propostas.find((item) => String(item.id) === String(propostaId));
    const anuncio = proposta ? anunciosPorId.get(String(proposta.anuncioId)) : null;

    if (!proposta || !anuncio) return;

    const transferencia = transferirVATs(proposta.compradorId, proposta.vendedorId, proposta.valorOfertado);

    if (!transferencia.ok) {
      alert(transferencia.mensagem);
      return;
    }

    aceitar(proposta.id);
    sincronizarGaragemAnuncio(anuncio, "concluido");
    moverItemGaragem(proposta.compradorId, itemGaragemFromAnuncio(anuncio), "concluido");
    carregarAnuncios();
  }

  function handleRecusar(propostaId) {
    const proposta = propostas.find((item) => String(item.id) === String(propostaId));
    const anuncio = proposta ? anunciosPorId.get(String(proposta.anuncioId)) : null;

    recusar(propostaId);

    if (anuncio) {
      sincronizarGaragemAnuncio(anuncio, "disponivel");
      removerItemGaragem(proposta.compradorId, anuncio.id);
      carregarAnuncios();
    }
  }

  function handleEncerrar(proposta) {
    if (proposta.status !== "pendente") {
      return;
    }

    const anuncio = anunciosPorId.get(String(proposta.anuncioId));

    encerrar(proposta.id);

    if (anuncio) {
      sincronizarGaragemAnuncio(anuncio, "disponivel");
      removerItemGaragem(proposta.compradorId, anuncio.id);
      carregarAnuncios();
    }
  }

  return (
    <section className="page">
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">Chat</p>
          <h1>Negociações</h1>
          <p>Acompanhe propostas, combine detalhes e encerre conversas pelo ReVeste.</p>
        </div>

        {minhasPropostas.length === 0 ? (
          <div className="empty-box">
            <h2>Nenhuma negociação aberta</h2>
            <p>Abra um anúncio de outro usuário e inicie uma conversa pelo botão de negociação.</p>
            <Link to={ROUTES.explorar} className="btn btn-primary">
              Explorar anúncios
            </Link>
          </div>
        ) : (
          <div className="negociacoes-grid">
            <aside className="negociacoes-lista">
              {minhasPropostas.map((proposta) => {
                const anuncio = anunciosPorId.get(String(proposta.anuncioId));
                const ativa = String(proposta.id) === String(selecionada?.id);

                return (
                  <button
                    key={proposta.id}
                    type="button"
                    className={`negociacao-item${ativa ? " ativa" : ""}`}
                    onClick={() => abrirNegociacao(proposta.id)}
                  >
                    <span>{anuncio?.titulo ?? "Anúncio removido"}</span>
                    <small>{statusLabel(proposta.status)}</small>
                  </button>
                );
              })}
            </aside>

            {selecionada && (
              <div className="negociacao-detalhe">
                <NegociacaoResumo
                  proposta={selecionada}
                  anuncio={anunciosPorId.get(String(selecionada.anuncioId))}
                />

                <AcoesNegociacao
                  id={selecionada.id}
                  status={selecionada.status}
                  onAceitar={handleAceitar}
                  onRecusar={handleRecusar}
                />

                <Chat
                  negociacaoId={selecionada.id}
                  usuarioAtualId={usuario.id}
                  canEncerrar={selecionada.status === "pendente"}
                  onEncerrar={() => handleEncerrar(selecionada)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function NegociacaoResumo({ proposta, anuncio }) {
  return (
    <div className="card card-body negociacao-resumo">
      <div>
        <p className="eyebrow">Proposta</p>
        <h2>{anuncio?.titulo ?? "Anúncio removido"}</h2>
        <p className="detalhe-meta">
          Status: <strong>{statusLabel(proposta.status)}</strong>
        </p>
      </div>

      <div>
        <p className="preco-label">Oferta em VATs</p>
        <p className="preco-valor">{formatVATs(proposta.valorOfertado)}</p>
        {anuncio?.preco ? (
          <p className="preco-neg">Referência: {formatPreco(anuncio.preco, anuncio.negociavel)}</p>
        ) : null}
        {anuncio && (
          <Link to={anuncioPath(anuncio.id)} className="secondary-link">
            Ver anúncio
          </Link>
        )}
      </div>
    </div>
  );
}

function statusLabel(status) {
  return {
    pendente: "Pendente",
    aceita: "Aceita",
    recusada: "Recusada",
    encerrada: "Encerrada",
  }[status] ?? status;
}

function formatVATs(valor) {
  const total = Number(valor);
  return `${Number.isFinite(total) ? total : 0} VATs`;
}
