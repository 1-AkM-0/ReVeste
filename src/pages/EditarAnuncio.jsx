import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnuncioForm from "../components/AnuncioForm";
import { getAnuncio, isOwner, updateAnuncio } from "../utils/anuncios";

const MOCK_USUARIO_ID = "user-123";

export default function EditarAnuncio() {
  const { id } = useParams();

  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const usuarioId = MOCK_USUARIO_ID;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm">Carregando...</span>
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

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Alterações salvas!</h2>
          <p className="text-sm text-gray-500 mb-6">
            O anúncio foi atualizado com sucesso.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to={`/anuncios/${id}`}
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors text-center"
            >
              Ver anúncio
            </Link>
            <button
              type="button"
              onClick={() => setSucesso(false)}
              className="w-full py-2.5 text-gray-600 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              Continuar editando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to={`/anuncios/${id}`}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para o anúncio
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Editar anúncio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Atualize as informações do seu anúncio.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
