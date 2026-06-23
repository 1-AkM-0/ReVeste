export function normalizar(str = "") {
  return String(str ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function score(anuncio, termo) {
  if (!termo) return 1;

  const t = normalizar(termo);
  const titulo = normalizar(anuncio?.titulo);
  const descricao = normalizar(anuncio?.descricao);
  const cidade = normalizar(anuncio?.cidade);
  const estado = normalizar(anuncio?.estado);
  const categoria = normalizar(anuncio?.categoria);

  let pontos = 0;
  if (titulo.startsWith(t)) pontos += 10;
  else if (titulo.includes(t)) pontos += 6;
  if (descricao.includes(t)) pontos += 3;
  if (cidade.includes(t)) pontos += 4;
  if (estado.includes(t)) pontos += 2;
  if (categoria.includes(t)) pontos += 1;

  return pontos;
}

export function buscarAnuncios(anuncios = [], termo = "") {
  if (!Array.isArray(anuncios)) return [];
  if (!termo?.trim()) return [...anuncios];

  const busca = termo.trim();

  return anuncios
    .map((anuncio) => ({ anuncio, pontos: score(anuncio, busca) }))
    .filter(({ pontos }) => pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .map(({ anuncio }) => anuncio);
}

export function highlight(texto = "", termo = "") {
  if (!termo.trim()) return [{ texto, destaque: false }];

  const busca = normalizar(termo.trim());
  const partes = [];
  let cursor = 0;

  const textoSeguro = String(texto ?? "");
  const textoNormalizado = normalizar(textoSeguro);
  let index = textoNormalizado.indexOf(busca, cursor);

  while (index !== -1) {
    if (index > cursor) {
      partes.push({ texto: textoSeguro.slice(cursor, index), destaque: false });
    }

    partes.push({ texto: textoSeguro.slice(index, index + busca.length), destaque: true });
    cursor = index + busca.length;
    index = textoNormalizado.indexOf(busca, cursor);
  }

  if (cursor < textoSeguro.length) {
    partes.push({ texto: textoSeguro.slice(cursor), destaque: false });
  }

  return partes;
}

export function sugestoes(anuncios = [], termo = "", limite = 5) {
  if (!Array.isArray(anuncios) || !termo || termo.length < 2) return [];

  const busca = normalizar(termo);
  const candidatos = new Set();

  for (const anuncio of anuncios) {
    const titulo = String(anuncio?.titulo ?? "");
    const cidade = String(anuncio?.cidade ?? "");

    if (normalizar(titulo).includes(busca)) candidatos.add(titulo);
    if (normalizar(cidade).includes(busca)) candidatos.add(cidade);
    if (candidatos.size >= limite * 2) break;
  }

  return [...candidatos]
    .filter(Boolean)
    .sort((a, b) => {
      const aNormalizado = normalizar(a);
      const bNormalizado = normalizar(b);
      const aInicio = aNormalizado.startsWith(busca) ? 0 : 1;
      const bInicio = bNormalizado.startsWith(busca) ? 0 : 1;

      return aInicio - bInicio || a.localeCompare(b, "pt-BR");
    })
    .slice(0, limite);
}
