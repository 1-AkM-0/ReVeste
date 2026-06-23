import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Busca from "../components/Busca";
import FiltrosAnuncios from "../components/FiltrosAnuncios";
import { useFiltros } from "../hooks/useFiltros";
import { listAnuncios } from "../utils/anuncios";
import AnuncioCard from "./AnuncioCard";

function Explorar() {
  const navigate = useNavigate();
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

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
      .then((data) => {
        if (ativo) setAnuncios(data);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os anúncios.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="eyebrow">Descubra</p>
          <h1>Explorar anúncios</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Carregando anúncios..." : `${total} anúncio${total === 1 ? "" : "s"} encontrado${total === 1 ? "" : "s"}.`}
          </p>
        </div>

        <Link
          to="/anuncios/novo"
          className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Novo anúncio
        </Link>
      </div>

      <Busca
        value={filtros.busca}
        onChange={(value) => setFiltro("busca", value)}
        onClear={limparBusca}
        anuncios={anuncios}
      />

      {erro && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <FiltrosAnuncios
          filtros={filtros}
          setFiltro={setFiltro}
          limpar={limpar}
          temFiltrosAtivos={temFiltrosAtivos}
          quantidadeFiltrosAtivos={quantidadeFiltrosAtivos}
        />

        <div>
          {loading ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-sm text-gray-400">
              Carregando...
            </div>
          ) : resultado.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {resultado.map((anuncio) => (
                <AnuncioCard
                  key={anuncio.id}
                  anuncio={anuncio}
                  onClick={() => navigate(`/anuncios/${anuncio.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Nenhum anúncio encontrado
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Ajuste os filtros ou publique um novo anúncio.
              </p>
              <Link
                to="/anuncios/novo"
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
              >
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
