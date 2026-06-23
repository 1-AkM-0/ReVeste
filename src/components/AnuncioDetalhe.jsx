import { useState } from "react";
import { CATEGORIAS, formatPreco, formatData } from "../utils/anuncios";

export default function AnuncioDetalhe({ anuncio, isOwner, onEditar, onExcluir }) {
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const badge = CATEGORIAS[anuncio.categoria] ?? { label: anuncio.categoria, bg: "bg-gray-100", text: "text-gray-600" };
  const temFotos = anuncio.imagens?.length > 0;

  const telefone = String(anuncio.contato ?? "").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(
    `Olá! Vi seu anúncio "${anuncio.titulo}" e tenho interesse.`
  )}`;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="w-full h-72 sm:h-96 bg-gray-50 flex items-center justify-center">
          {temFotos ? (
            <img
              src={anuncio.imagens[fotoAtiva]}
              alt={anuncio.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-300">
              <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm">Sem fotos</span>
            </div>
          )}
        </div>

        {temFotos && anuncio.imagens.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {anuncio.imagens.map((src, i) => (
              <button
                key={i}
                onClick={() => setFotoAtiva(i)}
                className={[
                  "w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                  i === fotoAtiva ? "border-gray-900" : "border-transparent opacity-60 hover:opacity-100",
                ].join(" ")}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
                <h1 className="text-xl font-semibold text-gray-900 leading-snug">
                  {anuncio.titulo}
                </h1>
              </div>

              {isOwner && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={onEditar}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={onExcluir}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-100 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Excluir
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {anuncio.cidade}, {anuncio.estado}
              {anuncio.criadoEm && (
                <span className="ml-2 text-gray-300">• Publicado em {formatData(anuncio.criadoEm)}</span>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Descrição</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {anuncio.descricao}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-1">Preço</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatPreco(anuncio.preco, anuncio.negociavel)}
            </p>
            {anuncio.negociavel && anuncio.preco && (
              <p className="text-xs text-gray-400 mt-1">Valor negociável</p>
            )}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-medium text-sm rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Entrar em contato
          </a>

          <p className="text-xs text-center text-gray-400">
            Você será redirecionado ao WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}
