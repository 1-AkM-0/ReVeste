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
      className="anuncio-card"
    >
      <div className="card-img">
        {anuncio.imagens?.[0] ? (
          <img src={anuncio.imagens[0]} alt={anuncio.titulo} />
        ) : (
          <svg
            width="40" height="40"
            fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        )}
      </div>

      <div className="card-content">
        <span
          className="badge"
          style={{ backgroundColor: badgeBg(anuncio.categoria), color: badgeText(anuncio.categoria) }}
        >
          {badge.label}
        </span>

        <h3 className="card-title">{anuncio.titulo}</h3>

        <p className="card-location">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {anuncio.cidade}, {anuncio.estado}
        </p>

        <p className="card-price">
          {anuncio.valorVATs ? `${anuncio.valorVATs} VATs` : formatPreco(anuncio.preco, anuncio.negociavel)}
        </p>
        {anuncio.modalidade && (
          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            {labelModalidade(anuncio.modalidade)}
          </span>
        )}
      </div>
    </article>
  );
}

function labelModalidade(val) {
  return { venda: "Venda", troca: "Troca", ambos: "Venda e Troca" }[val] ?? val;
}

function badgeBg(cat) {
  return {
    camiseta: "#eff6ff", calca: "#f0fdf4", vestido: "#faf5ff",
    saia: "#fdf4ff", shorts: "#fff1f2", jaqueta: "#eef2ff",
    calcado: "#f0fdfa", acessorio: "#fff7ed",
  }[cat] ?? "#f3f4f6";
}
function badgeText(cat) {
  return {
    camiseta: "#1d4ed8", calca: "#15803d", vestido: "#7e22ce",
    saia: "#a21caf", shorts: "#be123c", jaqueta: "#4338ca",
    calcado: "#0f766e", acessorio: "#c2410c",
  }[cat] ?? "#374151";
}
