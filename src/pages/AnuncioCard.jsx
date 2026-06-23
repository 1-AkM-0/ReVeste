import { CATEGORIAS, formatPreco } from "../utils/anuncios";

export default function AnuncioCard({ anuncio, onClick }) {
  const badge = CATEGORIAS[anuncio.categoria] ?? {
    label: anuncio.categoria || "Anúncio",
    bg: "bg-gray-100",
    text: "text-gray-600",
  };

  return (
    <article
      onClick={() => onClick?.(anuncio)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all active:scale-[0.99] group"
    >
      <div className="w-full h-40 bg-gray-50 overflow-hidden">
        {anuncio.imagens?.[0] ? (
          <img
            src={anuncio.imagens[0]}
            alt={anuncio.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>

        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
          {anuncio.titulo}
        </h3>

        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {anuncio.cidade}, {anuncio.estado}
        </p>

        <p className="text-base font-semibold text-gray-900">
          {formatPreco(anuncio.preco, anuncio.negociavel)}
        </p>
      </div>
    </article>
  );
}
