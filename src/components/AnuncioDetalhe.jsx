import { useState } from "react";
import { CATEGORIAS, formatPreco, formatData } from "../utils/anuncios";

export default function AnuncioDetalhe({ anuncio, isOwner, onEditar, onExcluir }) {
  const [fotoAtiva, setFotoAtiva] = useState(0);

  const cat    = CATEGORIAS[anuncio.categoria];
  const label  = cat?.label ?? anuncio.categoria;
  const bgColor  = catBg(anuncio.categoria);
  const txtColor = catText(anuncio.categoria);
  const temFotos = anuncio.imagens?.length > 0;

  const telefone   = String(anuncio.contato ?? "").replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(
    `Olá! Vi seu anúncio "${anuncio.titulo}" e tenho interesse.`
  )}`;

  return (
    <div className="detalhe-section">
      <div className="card">
        <div className="foto-principal">
          {temFotos ? (
            <img src={anuncio.imagens[fotoAtiva]} alt={anuncio.titulo} />
          ) : (
            <div className="foto-sem">
              <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>Sem fotos</span>
            </div>
          )}
        </div>

        {temFotos && anuncio.imagens.length > 1 && (
          <div className="miniaturas">
            {anuncio.imagens.map((src, i) => (
              <button
                key={i}
                onClick={() => setFotoAtiva(i)}
                className={`miniatura${i === fotoAtiva ? " ativa" : ""}`}
                aria-label={`Foto ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="detalhe-grid">
        <div className="detalhe-main detalhe-info">
          <div className="card card-body">
            <div className="detalhe-titulo-row">
              <div>
                <span
                  className="badge"
                  style={{ backgroundColor: bgColor, color: txtColor }}
                >
                  {label}
                </span>
                <h1 className="detalhe-titulo">{anuncio.titulo}</h1>
              </div>

              {isOwner && (
                <div className="detalhe-acoes">
                  <button
                    onClick={onEditar}
                    className="btn btn-ghost btn-sm"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={onExcluir}
                    className="btn btn-danger-ghost btn-sm"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Excluir
                  </button>
                </div>
              )}
            </div>

            <p className="detalhe-meta" style={{ marginTop: "0.75rem" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {anuncio.cidade}, {anuncio.estado}
              {anuncio.criadoEm && (
                <span className="detalhe-meta-sep">
                  • Publicado em {formatData(anuncio.criadoEm)}
                </span>
              )}
            </p>
          </div>

          <div className="card card-body">
            <h2 style={{ marginBottom: "0.75rem" }}>Descrição</h2>
            <p className="detalhe-descricao">{anuncio.descricao}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="card card-body">
            <p className="preco-label">Preço</p>
            <p className="preco-valor">{formatPreco(anuncio.preco, anuncio.negociavel)}</p>
            {anuncio.negociavel && anuncio.preco && (
              <p className="preco-neg">Valor negociável</p>
            )}
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Entrar em contato
          </a>

          <p className="contato-hint">Você será redirecionado ao WhatsApp</p>
        </div>
      </div>
    </div>
  );
}

function catBg(cat) {
  return { aluguel: "#eff6ff", venda: "#f0fdf4", produto: "#fffbeb", servico: "#faf5ff" }[cat] ?? "#f3f4f6";
}
function catText(cat) {
  return { aluguel: "#1d4ed8", venda: "#15803d", produto: "#b45309", servico: "#7e22ce" }[cat] ?? "#374151";
}
