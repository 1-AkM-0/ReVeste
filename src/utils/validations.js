const REQUIRED_MESSAGE = "Campo obrigatório.";

export const CATEGORIAS_ANUNCIO = Object.freeze([
  "camiseta",
  "calca",
  "vestido",
  "saia",
  "shorts",
  "jaqueta",
  "calcado",
  "acessorio",
]);

export const ESTADOS_BR = Object.freeze([
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]);

const IMAGE_EXTENSIONS = /\.(apng|avif|gif|jpe?g|png|webp)(\?.*)?$/i;
const IMAGE_DATA_URL = /^data:image\/(apng|avif|gif|jpe?g|png|webp);base64,/i;

export function isBlank(value) {
  return value === null || value === undefined || String(value).trim() === "";
}

export function isValidImageUrl(value) {
  if (isBlank(value)) return true;

  const text = String(value).trim();
  if (IMAGE_DATA_URL.test(text)) return true;

  try {
    const url = new URL(text);
    if (!["http:", "https:"].includes(url.protocol)) return false;

    return IMAGE_EXTENSIONS.test(url.pathname + url.search);
  } catch {
    return false;
  }
}

export function normalizePhotoUrls(imagens = []) {
  if (!Array.isArray(imagens)) return [];

  return imagens
    .map((imagem) => String(imagem ?? "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function sanitizeAnuncioForm(form = {}) {
  const imagens = normalizePhotoUrls(form.imagens);
  const fotoUrl = String(form.fotoUrl ?? "").trim();

  if (fotoUrl && isValidImageUrl(fotoUrl) && imagens.length < 5 && !imagens.includes(fotoUrl)) {
    imagens.push(fotoUrl);
  }

  return {
    titulo: String(form.titulo ?? "").trim(),
    marca: String(form.marca ?? "").trim(),
    categoria: String(form.categoria ?? "").trim(),
    descricao: String(form.descricao ?? "").trim(),
    preco: isBlank(form.preco) ? "" : Number(form.preco),
    negociavel: Boolean(form.negociavel),
    contato: String(form.contato ?? "").trim(),
    cidade: String(form.cidade ?? "").trim(),
    estado: String(form.estado ?? "").trim().toUpperCase(),
    tamanho: String(form.tamanho ?? "").trim(),
    etiquetaOriginal: Boolean(form.etiquetaOriginal),
    imagens,
  };
}

export function validateAnuncioForm(form = {}) {
  const errors = {};
  const sanitized = sanitizeAnuncioForm(form);

  if (isBlank(sanitized.titulo)) {
    errors.titulo = "Informe um título.";
  } else if (sanitized.titulo.length > 100) {
    errors.titulo = "Use até 100 caracteres.";
  }

  if (isBlank(sanitized.marca)) {
    errors.marca = "Informe a marca da peça.";
  }

  if (isBlank(sanitized.categoria)) {
    errors.categoria = "Selecione uma categoria.";
  } else if (!CATEGORIAS_ANUNCIO.includes(sanitized.categoria)) {
    errors.categoria = "Categoria inválida.";
  }

  if (isBlank(sanitized.tamanho)) {
    errors.tamanho = "Selecione o tamanho.";
  }
  if (isBlank(sanitized.descricao)) {
    errors.descricao = "Descreva o anúncio.";
  } else if (sanitized.descricao.length > 1500) {
    errors.descricao = "Use até 1500 caracteres.";
  }

  if (!isBlank(form.preco) && (!Number.isFinite(sanitized.preco) || sanitized.preco < 0)) {
    errors.preco = "Informe um preço válido.";
  }

  if (isBlank(sanitized.contato)) {
    errors.contato = "Informe um contato.";
  }

  if (isBlank(sanitized.cidade)) {
    errors.cidade = "Informe a cidade.";
  }

  if (isBlank(sanitized.estado)) {
    errors.estado = "Selecione o estado.";
  } else if (!ESTADOS_BR.includes(sanitized.estado)) {
    errors.estado = "Estado inválido.";
  }

  if (!isBlank(form.fotoUrl) && !isValidImageUrl(form.fotoUrl)) {
    errors.fotoUrl = "Informe uma URL de imagem válida.";
  }

  const urlInvalida = normalizePhotoUrls(form.imagens).find((imagem) => !isValidImageUrl(imagem));
  if (urlInvalida) {
    errors.imagens = "Remova a foto com URL inválida.";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors ?? {}).length > 0;
}

export { REQUIRED_MESSAGE };
