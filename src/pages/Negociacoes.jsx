import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AcoesNegociacao from "../components/AcoesNegociacao";
import Chat from "../components/Chat";
import PropostaTroca from "../components/PropostaTroca";
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
  const [tipoContraproposta, setTipoContraproposta] = useState("venda");
  const [dadosTrocaContraproposta, setDadosTrocaContraproposta] = useState({ itensTroca: [], vatsComplementar: 0 });
  const [minhasPecas, setMinhasPecas] = useState([]);

  useEffect(() => {
    carregarAnuncios();
  }, []);

  function carregarAnuncios() {
    listAnuncios({ incluirInativos: true }).then(setAnuncios).catch(() => setAnuncios([]));
  }

  function carregarMinhasPecas() {
    if (!usuario?.id) return;
    listAnuncios({ incluirInativos: true }).then((todos) => {
      const pecas = todos.filter(
        (a) =>
          String(a.usuarioId) === String(usuario.id) &&
          a.status !== "excluido"
      );
      setMinhasPecas(pecas);
    });
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

  function handleContrapor() {
    carregarMinhasPecas();
    if (selecionada) {
      setTipoContraproposta(selecionada.tipo === "troca" ? "troca" : "venda");
      setValorContraproposta(String(selecionada.valorOfertado || ""));
      setDadosTrocaContraproposta({
        itensTroca: selecionada.itensTroca || [],
        vatsComplementar: selecionada.vatsComplementar || 0,
      });
    }
    setModoContraproposta(true);
  }

  function enviarContraproposta() {
    if (!selecionada) return;

    const dados = {};

    if (tipoContraproposta === "venda") {
      if (valorContraproposta !== "") {
        dados.valorOfertado = Number(valorContraproposta);
      }
      dados.tipo = "venda";
      dados.itensTroca = [];
      dados.vatsComplementar = 0;
    } else {
      dados.tipo = "troca";
      dados.valorOfertado = 0;
      dados.itensTroca = dadosTrocaContraproposta.itensTroca;
      dados.vatsComplementar = Number(dadosTrocaContraproposta.vatsComplementar);
    }

    contrapor(selecionada.id, dados);
    setModoContraproposta(false);
    setValorContraproposta("");
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
                  onContrapor={selecionada.status === "pendente" ? handleContrapor : null}
                />

                {modoContraproposta && (
                  <div style={{padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", marginTop: "1rem"}}>
                    <h3>Contraproposta</h3>

                    <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <button
                        type="button"
                        className={`btn ${tipoContraproposta === "venda" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setTipoContraproposta("venda")}
                        style={{ flex: 1 }}
                      >
                        Venda
                      </button>
                      <button
                        type="button"
                        className={`btn ${tipoContraproposta === "troca" ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => setTipoContraproposta("troca")}
                        style={{ flex: 1 }}
                      >
                        Troca
                      </button>
                    </div>

                    {tipoContraproposta === "venda" ? (
                      <input
                        type="number"
                        placeholder="Novo valor em VATs"
                        value={valorContraproposta}
                        onChange={e => setValorContraproposta(e.target.value)}
                        style={{padding: "0.5rem", width: "100%", boxSizing: "border-box", marginBottom: "0.5rem"}}
                      />
                    ) : (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <PropostaTroca
                          minhasPecas={minhasPecas}
                          onChange={setDadosTrocaContraproposta}
                        />
                      </div>
                    )}

                    <div style={{display: "flex", gap: "0.5rem"}}>
                      <button className="btn btn-primary" onClick={enviarContraproposta}>Enviar</button>
                      <button className="btn btn-ghost" onClick={() => setModoContraproposta(false)}>Cancelar</button>
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
          Tipo: <strong>{proposta.tipo === "troca" ? "Troca" : "Venda"}</strong>
        </p>
      </div>

      <div>
        {proposta.tipo === "troca" ? (
          <>
            {proposta.itensTroca && proposta.itensTroca.length > 0 && (
              <div>
                <p className="preco-label">Peças oferecidas:</p>
                <ul style={{margin: "0.25rem 0 0 1.5rem"}}>
                  {proposta.itensTroca.map((item, idx) => (
                    <li key={idx}>{item.titulo}</li>
                  ))}
                </ul>
              </div>
            )}
            {proposta.vatsComplementar > 0 && (
              <p style={{marginTop: "0.5rem", fontSize: "0.9rem", color: "#666"}}>
                VAT complementar: {proposta.vatsComplementar}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="preco-label">Oferta em VATs</p>
            <p className="preco-valor">{formatVATs(proposta.valorOfertado)}</p>
          </>
        )}
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
