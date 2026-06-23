import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AcoesNegociacao from "../components/AcoesNegociacao";
import Chat from "../components/Chat";
import TimelineProposta from "../components/TimelineProposta";
import { useAuth } from "../context/AuthContext";
import { useNegociacao } from "../context/NegociacaoContext";
import { anuncioPath, negociacaoPath, ROUTES } from "../routes";
import { formatPreco, listAnuncios } from "../utils/anuncios";
import { itemGaragemFromAnuncio, moverItemGaragem, removerItemGaragem, sincronizarGaragemAnuncio } from "../utils/garagem";

export default function Negociacoes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, transferirVATs } = useAuth();
  const { propostas, aceitar, recusar, encerrar, contrapor } = useNegociacao();
  const [anuncios, setAnuncios] = useState([]);
  const [modoContraproposta, setModoContraproposta] = useState(false);
  const [valorContraproposta, setValorContraproposta] = useState("");
  const [vatsContraproposta, setVatsContraproposta] = useState("");

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

  function handleContrapor(propostaId) {
    setModoContraproposta(true);
  }

  function enviarContraproposta() {
    if (!selecionada) return;

    const dados = {};
    if (valorContraproposta !== "") {
      dados.valorOfertado = Number(valorContraproposta);
    }
    if (vatsContraproposta !== "") {
      dados.vatsComplementar = Number(vatsContraproposta);
    }

    contrapor(selecionada.id, dados);
    setModoContraproposta(false);
    setValorContraproposta("");
    setVatsContraproposta("");
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
                  onContrapor={handleContrapor}
                />

                {modoContraproposta && (
                  <div style={{padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginTop: "1rem"}}>
                    <h3>Contraproposta</h3>
                    <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                      <input
                        type="number"
                        placeholder="Novo valor em VATs"
                        value={valorContraproposta}
                        onChange={e => setValorContraproposta(e.target.value)}
                        style={{padding: "0.5rem"}}
                      />
                      <input
                        type="number"
                        placeholder="VAT complementar"
                        value={vatsContraproposta}
                        onChange={e => setVatsContraproposta(e.target.value)}
                        style={{padding: "0.5rem"}}
                      />
                      <div style={{display: "flex", gap: "0.5rem"}}>
                        <button className="btn btn-primary" onClick={enviarContraproposta}>Enviar</button>
                        <button className="btn btn-ghost" onClick={() => setModoContraproposta(false)}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                )}

                {selecionada.historico && selecionada.historico.length > 0 && (
                  <div style={{marginTop: "1rem"}}>
                    <h3>Histórico da Negociação</h3>
                    <TimelineProposta historico={selecionada.historico} />
                  </div>
                )}

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
        <p className="detalhe-meta">
          Tipo: <strong>{proposta.tipo === "venda" ? "Venda" : "Troca"}</strong>
        </p>
      </div>

      <div>
        <p className="preco-label">Oferta em VATs</p>
        <p className="preco-valor">{formatVATs(proposta.valorOfertado)}</p>
        {anuncio?.preco ? (
          <p className="preco-neg">Referência: {formatPreco(anuncio.preco, anuncio.negociavel)}</p>
        ) : null}
        {proposta.itensTroca && proposta.itensTroca.length > 0 && (
          <div style={{marginTop: "0.5rem"}}>
            <p className="preco-label">Peças oferecidas na troca:</p>
            <ul style={{margin: "0.25rem 0 0 1.5rem"}}>
              {proposta.itensTroca.map((item, idx) => (
                <li key={idx}>{item.titulo}</li>
              ))}
            </ul>
          </div>
        )}
        {proposta.vatsComplementar > 0 && (
          <p style={{marginTop: "0.25rem", fontSize: "0.9rem", color: "#666"}}>
            VAT complementar: {proposta.vatsComplementar}
          </p>
        )}
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
