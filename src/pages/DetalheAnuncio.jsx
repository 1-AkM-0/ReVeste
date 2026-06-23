import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnuncioDetalhe from "../components/AnuncioDetalhe";
import PropostaTroca from "../components/PropostaTroca";
import { useAuth } from "../context/AuthContext";
import { useNegociacao } from "../context/NegociacaoContext";
import { negociacaoPath, ROUTES } from "../routes";
import { deleteAnuncio, getAnuncio, isOwner, listAnuncios } from "../utils/anuncios";
import { itemGaragemFromAnuncio, moverItemGaragem, sincronizarGaragemAnuncio } from "../utils/garagem";
import { criarProposta } from "../utils/schemas";
import { saoEquivalentes, sugerirComplemento } from "../utils/vats";

export default function DetalheAnuncio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { propostas, criar } = useNegociacao();

  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const [modalProposta, setModalProposta] = useState(false);
  const [tipoProposta, setTipoProposta] = useState("venda");
  const [valorOfertado, setValorOfertado] = useState("");
  const [dadosTroca, setDadosTroca] = useState({ itensTroca: [], vatsComplementar: 0 });
  const [minhasPecas, setMinhasPecas] = useState([]);

  const usuarioId = usuario?.id;
  const dono = anuncio ? isOwner(anuncio, usuarioId) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErro(null);

    getAnuncio(id)
      .then(setAnuncio)
      .catch(() => setErro("Não foi possível carregar o anúncio."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleExcluir() {
    if (!confirmar) {
      setConfirmar(true);
      return;
    }

    setExcluindo(true);
    try {
      await deleteAnuncio(id);
      navigate("/explorar");
    } catch {
      alert("Erro ao excluir o anúncio. Tente novamente.");
      setExcluindo(false);
      setConfirmar(false);
    }
  }

  function handleEditar() {
    navigate(`/anuncios/${id}/editar`);
  }

  function handleNegociar() {
    if (!usuario) {
      navigate(ROUTES.login);
      return;
    }

    if (String(anuncio.usuarioId) === String(usuario.id)) {
      alert("Você não pode negociar com seu próprio anúncio.");
      return;
    }

    const existente = propostas.find(
      (proposta) =>
        String(proposta.anuncioId) === String(anuncio.id) &&
        String(proposta.compradorId) === String(usuario.id) &&
        proposta.status !== "recusada" &&
        proposta.status !== "encerrada"
    );

    if (existente) {
      navigate(negociacaoPath(existente.id));
      return;
    }

    carregarMinhasPecas();
    setValorOfertado(String(anuncio.preco || ""));
    setTipoProposta("venda");
    setDadosTroca({ itensTroca: [], vatsComplementar: 0 });
    setModalProposta(true);
  }

  function carregarMinhasPecas() {
    if (!usuario?.id) return;
    listAnuncios({ incluirInativos: true }).then((todos) => {
      const pecas = todos.filter(
        (a) =>
          String(a.usuarioId) === String(usuario.id) &&
          String(a.id) !== String(id) &&
          a.status !== "excluido"
      );
      setMinhasPecas(pecas);
    });
  }

  function confirmarProposta() {
    if (String(anuncio.usuarioId) === String(usuario.id)) {
      alert("Você não pode negociar com seu próprio anúncio.");
      setModalProposta(false);
      return;
    }

    if (tipoProposta === "venda") {
      const valorAnunciado = Number(anuncio.valorVATs || anuncio.preco || 0);
      const valorOferta = Number(valorOfertado);
      if (valorAnunciado > 0 && valorOferta > valorAnunciado) {
        alert(`O valor ofertado (${valorOferta} VATs) não pode ser maior que o valor anunciado (${valorAnunciado} VATs).`);
        return;
      }
    }

    if (tipoProposta === "troca" && dadosTroca.itensTroca.length === 0) {
      alert("Selecione pelo menos 1 peça para a troca.");
      return;
    }

    const proposta = criarProposta({
      anuncioId: anuncio.id,
      compradorId: usuario.id,
      vendedorId: anuncio.usuarioId,
      tipo: tipoProposta,
      valorOfertado: tipoProposta === "venda" ? Number(valorOfertado) : 0,
      itensTroca: tipoProposta === "troca" ? dadosTroca.itensTroca : [],
      vatsComplementar: tipoProposta === "troca" ? Number(dadosTroca.vatsComplementar) : 0,
    });

    criar(proposta);
    sincronizarGaragemAnuncio(anuncio, "negociacao");
    moverItemGaragem(usuario.id, itemGaragemFromAnuncio(anuncio), "negociacao");
    setModalProposta(false);
    navigate(negociacaoPath(proposta.id));
  }

  if (loading) {
    return (
      <div className="page-centered">
        <div className="spinner-wrap">
          <svg className="spinner" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="spinner-text">Carregando anúncio...</span>
        </div>
      </div>
    );
  }

  if (erro || !anuncio) {
    return (
      <div className="page-centered">
        <div className="error-box">
          <p>{erro ?? "Anúncio não encontrado."}</p>
          <Link to="/explorar">Voltar para Explorar</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Link to="/explorar" className="back-link">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Explorar
        </Link>

        <AnuncioDetalhe
          anuncio={anuncio}
          isOwner={dono}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          onNegociar={handleNegociar}
        />
      </div>

      {confirmar && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">
              <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="modal-title">Excluir anúncio?</h2>
            <p className="modal-desc">
              Essa ação não pode ser desfeita. O anúncio será removido permanentemente.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setConfirmar(false)}
                disabled={excluindo}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExcluir}
                disabled={excluindo}
                className="btn btn-danger"
              >
                {excluindo ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalProposta && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: "500px" }}>
            <h2 className="modal-title">Nova Proposta</h2>
            <p className="modal-desc">Escolha o tipo de negociação para <strong>{anuncio.titulo}</strong></p>

            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <button
                type="button"
                className={`btn ${tipoProposta === "venda" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTipoProposta("venda")}
                style={{ flex: 1 }}
              >
                Venda
              </button>
              <button
                type="button"
                className={`btn ${tipoProposta === "troca" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTipoProposta("troca")}
                style={{ flex: 1 }}
              >
                Troca
              </button>
            </div>

            {tipoProposta === "venda" ? (
              <div style={{ marginBottom: "1rem" }}>
                <label className="field-label">Valor oferecido (VATs)</label>
                <input
                  type="number"
                  value={valorOfertado}
                  onChange={(e) => setValorOfertado(e.target.value)}
                  placeholder="Valor em VATs"
                  min={0}
                  className="input"
                />
                {(anuncio.valorVATs || anuncio.preco) > 0 && (
                  <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                    Valor anunciado: {anuncio.valorVATs || anuncio.preco} VATs
                  </p>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: "1rem" }}>
                <PropostaTroca
                  minhasPecas={minhasPecas}
                  onChange={setDadosTroca}
                />
                {anuncio.valorVATs > 0 && dadosTroca.itensTroca.length > 0 && (
                  <VATSugestao
                    valorAnuncio={Number(anuncio.valorVATs)}
                    itensOfertados={dadosTroca.itensTroca}
                    vatsComplementar={Number(dadosTroca.vatsComplementar)}
                  />
                )}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setModalProposta(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmarProposta}
              >
                Enviar Proposta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VATSugestao({ valorAnuncio, itensOfertados, vatsComplementar }) {
  const totalItens = itensOfertados.reduce((sum, item) => sum + Number(item.valorVATs || item.preco || 0), 0);
  const totalOferta = totalItens + vatsComplementar;

  if (totalOferta <= 0) return null;

  const equivalente = saoEquivalentes(valorAnuncio, totalOferta);
  const sugestao = sugerirComplemento(valorAnuncio, totalOferta);

  if (equivalente) {
    return (
      <p style={{ fontSize: "0.85rem", color: "#15803d", marginTop: "0.5rem" }}>
        Valores equivalentes (diferença dentro de 20%).
      </p>
    );
  }

  return (
    <p style={{ fontSize: "0.85rem", color: "#b45309", marginTop: "0.5rem" }}>
      A diferença entre o valor do anúncio ({valorAnuncio} VATs) e sua oferta ({totalOferta} VATs) é maior que 20%.
      {sugestao > 0 && ` Sugestão: adicione mais ${sugestao} VATs para equiparar.`}
    </p>
  );
}
