export function normalizar(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function score(anuncio, termo) {
  if (!termo) return 1; 
  const t = normalizar(termo);

  const titulo    = normalizar(anuncio.titulo ?? "");
  const descricao = normalizar(anuncio.descricao ?? "");
  const cidade    = normalizar(anuncio.cidade ?? "");
  const estado    = normalizar(anuncio.estado ?? "");

  let pts = 0;
  if (titulo.startsWith(t))    pts += 10;
  else if (titulo.includes(t)) pts += 6;
  if (descricao.includes(t))   pts += 3;
  if (cidade.includes(t))      pts += 4;
  if (estado.includes(t))      pts += 2;

  return pts;
}
  
   @param {Array}  anuncios 
   @param {string} termo    
   @returns {Array} 

export function buscarAnuncios(anuncios, termo) {
  if (!termo?.trim()) return anuncios;

  return anuncios
    .map((a) => ({ anuncio: a, pts: score(a, termo.trim()) }))
    .filter(({ pts }) => pts > 0)
    .sort((a, b) => b.pts - a.pts)
    .map(({ anuncio }) => anuncio);
}
  
   @param {string} texto
   @param {string} termo
   @returns {Array<{ texto: string, destaque: boolean }>}
  
   @example

export function highlight(texto = "", termo = "") {
  if (!termo.trim()) return [{ texto, destaque: false }];

  const t = normalizar(termo.trim());
  const partes = [];
  let cursor = 0;

  const textoNorm = normalizar(texto);
  let idx = textoNorm.indexOf(t, cursor);

  while (idx !== -1) {
    if (idx > cursor) partes.push({ texto: texto.slice(cursor, idx), destaque: false });
    partes.push({ texto: texto.slice(idx, idx + t.length), destaque: true });
    cursor = idx + t.length;
    idx = textoNorm.indexOf(t, cursor);
  }

  if (cursor < texto.length) partes.push({ texto: texto.slice(cursor), destaque: false });
  return partes;
}
  
   @param {Array}  anuncios
   @param {string} termo
   @param {number} limite
   @returns {string[]}

export function sugestoes(anuncios, termo, limite = 5) {
  if (!termo || termo.length < 2) return [];
  const t = normalizar(termo);

  const candidatos = new Set();
  for (const a of anuncios) {
    if (normalizar(a.titulo).includes(t))  candidatos.add(a.titulo);
    if (normalizar(a.cidade).includes(t))  candidatos.add(a.cidade);
    if (candidatos.size >= limite * 2) break;
  }

  return [...candidatos]
    .sort((a, b) => {
      const an = normalizar(a), bn = normalizar(b);
      const aStart = an.startsWith(t) ? 0 : 1;
      const bStart = bn.startsWith(t) ? 0 : 1;
      return aStart - bStart || a.localeCompare(b, "pt-BR");
    })
    .slice(0, limite);
}
