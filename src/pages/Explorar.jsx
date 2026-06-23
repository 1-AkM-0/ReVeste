import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Busca from "../components/Busca";
import FiltrosAnuncios from "../components/FiltrosAnuncios";
import AnuncioCard from "../components/AnuncioCard";
import { useFiltros } from "../hooks/useFiltros";
import { listAnuncios } from "../utils/anuncios";

function Explorar() {
  const navigate = useNavigate();
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [erro, setErro]         = useState(null);

  const {
    filtros,
    setFiltro,
    limpar,
    limparBusca,
    resultado,
    total,
    temFiltrosAtivos,
    quantidadeFiltrosAtivos,
  } = useFiltros(anuncios);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setErro(null);

    listAnuncios()
      .then((data) => { if (ativo) setAnuncios(data); })
      .catch(() => { if (ativo) setErro("Não foi possível carregar os anúncios."); })
      .finally(() => { if (ativo) setLoading(false); });

    return () => { ativo = false; };
  }, []);

  return (
    <section className="explorar-section">
      <div className="explorar-header">
        <div>
          <p className="eyebrow">Descubra</p>
          <h1>Explorar anúncios</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
            {loading
              ? "Carregando anúncios..."
              : `${total} anúncio${total === 1 ? "" : "s"} encontrado${total === 1 ? "" : "s"}.`}
          </p>
        </div>

        <Link to="/anuncios/novo" className="btn btn-primary">
          Novo anúncio
        </Link>
      </div>

      <Busca
        value={filtros.busca}
        onChange={(value) => setFiltro("busca", value)}
        onClear={limparBusca}
        anuncios={anuncios}
      />

      {erro && <div className="alert-error">{erro}</div>}

      <div className="explorar-grid">
        <FiltrosAnuncios
          filtros={filtros}
          setFiltro={setFiltro}
          limpar={limpar}
          temFiltrosAtivos={temFiltrosAtivos}
          quantidadeFiltrosAtivos={quantidadeFiltrosAtivos}
        />

        <div>
          {loading ? (
            <div className="card card-body" style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
              Carregando...
            </div>
          ) : resultado.length > 0 ? (
            <div className="anuncios-grid anim-stagger">
              {resultado.map((anuncio) => (
                <AnuncioCard
                  key={anuncio.id}
                  anuncio={anuncio}
                  onClick={() => navigate(`/anuncios/${anuncio.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-box">
              <h2>Nenhum anúncio encontrado</h2>
              <p>Ajuste os filtros ou publique um novo anúncio.</p>
              <Link to="/anuncios/novo" className="btn btn-primary">
                Criar anúncio
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Explorar;
