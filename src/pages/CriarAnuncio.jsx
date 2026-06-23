import { useState } from "react";
import AnuncioForm from "../components/AnuncioForm";

export default function CriarAnuncio() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(dados) {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSucesso(true);
    } catch (err) {
      console.error("Erro ao publicar anúncio:", err);
      alert("Não foi possível publicar o anúncio. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Anúncio publicado!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Seu anúncio já está visível na página Explorar.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="/explorar"
              className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors text-center"
            >
              Ver anúncios
            </a>
            <button
              onClick={() => setSucesso(false)}
              className="w-full py-2.5 text-gray-600 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              Criar outro anúncio
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
          <a
            href="/explorar"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar
          </a>
          <h1 className="text-2xl font-semibold text-gray-900">Novo anúncio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Preencha os dados abaixo para publicar seu anúncio gratuitamente.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <AnuncioForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
