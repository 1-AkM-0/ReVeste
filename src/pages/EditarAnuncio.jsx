import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import AnuncioForm from "../components/AnuncioForm";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";
import { getAnuncio, isOwner, updateAnuncio } from "../utils/anuncios";

export default function EditarAnuncio() {
  const { id } = useParams();
  const { usuario } = useAuth();

  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [erro, setErro]       = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const usuarioId = usuario?.id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErro(null);

    getAnuncio(id)
      .then((data) => {
        if (!isOwner(data, usuarioId)) {
          setErro("Você não tem permissão para editar este anúncio.");
          return;
        }
        setAnuncio(data);
      })
      .catch(() => setErro("Não foi possível carregar o anúncio."))
      .finally(() => setLoading(false));
  }, [id, usuarioId]);

  async function handleSubmit(dados) {
    setSaving(true);
    try {
      const atualizado = await updateAnuncio(id, dados);
      setAnuncio(atualizado);
      setSucesso(true);
    } catch {
      alert("Erro ao salvar as alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (!usuario) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (loading) {
    return (
      <div className="page-centered">
        <div className="spinner-wrap">
          <svg className="spinner" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="spinner-text">Carregando...</span>
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

  if (sucesso) {
    return (
      <div className="page-centered">
        <div className="success-box">
          <div className="success-icon">
            <svg width="28" height="28" fill="none" stroke="#22c55e" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="success-title">Alterações salvas!</h2>
          <p className="success-desc">O anúncio foi atualizado com sucesso.</p>
          <div className="success-actions">
            <Link
              to={`/anuncios/${id}`}
              className="btn btn-primary btn-full btn-lg"
            >
              Ver anúncio
            </Link>
            <button
              type="button"
              onClick={() => setSucesso(false)}
              className="btn btn-ghost btn-full btn-lg"
            >
              Continuar editando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container-sm">
        <div className="page-header">
          <Link to={`/anuncios/${id}`} className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para o anúncio
          </Link>
          <h1>Editar anúncio</h1>
          <p>Atualize as informações do seu anúncio.</p>
        </div>

        <div className="card card-body-lg">
          <AnuncioForm
            initialValues={anuncio}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Salvar alterações"
          />
        </div>
      </div>
    </div>
  );
}
