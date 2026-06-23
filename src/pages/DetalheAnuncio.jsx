import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnuncioDetalhe from "../components/AnuncioDetalhe";
import { useAuth } from "../context/AuthContext";
import { useNegociacao } from "../context/NegociacaoContext";
import { negociacaoPath, ROUTES } from "../routes";
import { deleteAnuncio, getAnuncio, isOwner } from "../utils/anuncios";
import { itemGaragemFromAnuncio, moverItemGaragem, sincronizarGaragemAnuncio } from "../utils/garagem";
import { criarProposta } from "../utils/schemas";

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

    const proposta = criarProposta({
      anuncioId: anuncio.id,
      compradorId: usuario.id,
      vendedorId: anuncio.usuarioId,
      tipo: anuncio.categoria === "servico" ? "servico" : "venda",
      valorOfertado: Number(anuncio.preco || 0),
    });

    criar(proposta);
    sincronizarGaragemAnuncio(anuncio, "negociacao");
    moverItemGaragem(usuario.id, itemGaragemFromAnuncio(anuncio), "negociacao");
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
    </div>
  );
}
