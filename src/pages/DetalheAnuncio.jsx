import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnuncioDetalhe from "../components/AnuncioDetalhe";
import { deleteAnuncio, getAnuncio, isOwner } from "../utils/anuncios";

const MOCK_USUARIO_ID = "user-123";

export default function DetalheAnuncio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const usuarioId = MOCK_USUARIO_ID;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Carregando anúncio...</span>
        </div>
      </div>
    );
  }

  if (erro || !anuncio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{erro ?? "Anúncio não encontrado."}</p>
          <Link to="/explorar" className="text-sm text-gray-700 underline underline-offset-2 hover:text-gray-900">
            Voltar para Explorar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/explorar"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Explorar
        </Link>

        <AnuncioDetalhe
          anuncio={anuncio}
          isOwner={dono}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      </div>

      {confirmar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900 text-center mb-1">
              Excluir anúncio?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Essa ação não pode ser desfeita. O anúncio será removido permanentemente.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmar(false)}
                disabled={excluindo}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExcluir}
                disabled={excluindo}
                className="flex-1 py-2.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
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
