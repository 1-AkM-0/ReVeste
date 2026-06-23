import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AnuncioForm from "../components/AnuncioForm";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes";
import { createAnuncio } from "../utils/anuncios";

export default function CriarAnuncio() {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [anuncioCriado, setAnuncioCriado] = useState(null);

  async function handleSubmit(dados) {
    setLoading(true);
    try {
      const anuncio = await createAnuncio(dados, usuario.id);
      setAnuncioCriado(anuncio);
    } catch (err) {
      console.error("Erro ao publicar anúncio:", err);
      alert("Não foi possível publicar o anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!usuario) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (anuncioCriado) {
    return (
      <div className="page-centered">
        <div className="success-box">
          <div className="success-icon">
            <svg width="28" height="28" fill="none" stroke="#22c55e" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="success-title">Anúncio publicado!</h2>
          <p className="success-desc">Seu anúncio já está visível na página Explorar.</p>
          <div className="success-actions">
            <Link
              to={`/anuncios/${anuncioCriado.id}`}
              className="btn btn-primary btn-full btn-lg"
            >
              Ver anúncio
            </Link>
            <button
              type="button"
              onClick={() => setAnuncioCriado(null)}
              className="btn btn-ghost btn-full btn-lg"
            >
              Criar outro anúncio
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
          <Link to="/explorar" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar
          </Link>
          <h1>Novo anúncio</h1>
          <p>Preencha os dados abaixo para publicar seu anúncio gratuitamente.</p>
        </div>

        <div className="card card-body-lg">
          <AnuncioForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
