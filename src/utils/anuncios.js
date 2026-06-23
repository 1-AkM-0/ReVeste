import { generateId } from "./ids";
import { getStorage, setStorage } from "./storage";
import { isBlank, sanitizeAnuncioForm } from "./validations";

export const ANUNCIOS_STORAGE_KEY = "reveste_anuncios";
export const DEFAULT_OWNER_ID = "user-123";

export const CATEGORIAS = Object.freeze({
  camiseta: { label: "Camiseta" },
  calca: { label: "Calça" },
  vestido: { label: "Vestido" },
  saia: { label: "Saia" },
  shorts: { label: "Shorts" },
  jaqueta: { label: "Jaqueta" },
  calcado: { label: "Calçado" },
  acessorio: { label: "Acessório" },
});

const ANUNCIOS_INICIAIS = [
  {
    id: "anuncio_demo_jaqueta",
    usuarioId: "user-456",
    titulo: "Jaqueta jeans",
    categoria: "jaqueta",
    descricao: "Jaqueta jeans azul em ótimo estado, com pouco uso.",
    valorVATs: 35,
    modalidade: "ambos",
    estadoConservacao: "bom",
    contato: "(88) 99999-0000",
    cidade: "Juazeiro do Norte",
    estado: "CE",
    tamanho: "M",
    imagens: [],
    status: "ativo",
    criadoEm: "2026-01-15T12:00:00.000Z",
    atualizadoEm: "2026-01-15T12:00:00.000Z",
  },
];

function readAnuncios() {
  const stored = getStorage(ANUNCIOS_STORAGE_KEY, null);
  return Array.isArray(stored) ? stored : ANUNCIOS_INICIAIS;
}

function saveAnuncios(anuncios) {
  setStorage(ANUNCIOS_STORAGE_KEY, anuncios);
  return anuncios;
}

function findIndexById(anuncios, id) {
  return anuncios.findIndex((anuncio) => String(anuncio.id) === String(id));
}

export async function listAnuncios({ incluirInativos = false } = {}) {
  const anuncios = readAnuncios();
  return incluirInativos ? anuncios : anuncios.filter((anuncio) => anuncio.status !== "excluido");
}

export async function getAnuncio(id) {
  const anuncio = readAnuncios().find((item) => String(item.id) === String(id));

  if (!anuncio || anuncio.status === "excluido") {
    throw new Error("Anúncio não encontrado.");
  }

  return anuncio;
}

export async function createAnuncio(dados, usuarioId = DEFAULT_OWNER_ID) {
  const now = new Date().toISOString();
  const anuncio = {
    ...sanitizeAnuncioForm(dados),
    id: generateId("anuncio"),
    usuarioId,
    status: "ativo",
    criadoEm: now,
    atualizadoEm: now,
  };

  saveAnuncios([anuncio, ...readAnuncios()]);
  return anuncio;
}

export async function updateAnuncio(id, dados) {
  const anuncios = readAnuncios();
  const index = findIndexById(anuncios, id);

  if (index === -1) {
    throw new Error("Anúncio não encontrado.");
  }

  const atual = anuncios[index];
  const atualizado = {
    ...atual,
    ...sanitizeAnuncioForm(dados),
    id: atual.id,
    usuarioId: atual.usuarioId,
    status: atual.status ?? "ativo",
    criadoEm: atual.criadoEm,
    atualizadoEm: new Date().toISOString(),
  };

  const proximos = [...anuncios];
  proximos[index] = atualizado;
  saveAnuncios(proximos);
  return atualizado;
}

export async function deleteAnuncio(id) {
  const anuncios = readAnuncios();
  const index = findIndexById(anuncios, id);

  if (index === -1) {
    throw new Error("Anúncio não encontrado.");
  }

  const proximos = anuncios.filter((anuncio) => String(anuncio.id) !== String(id));
  saveAnuncios(proximos);
  return true;
}

export function atualizarStatusAnuncio(anuncioId, novoStatus) {
  const anuncios = readAnuncios();
  const index = findIndexById(anuncios, anuncioId);

  if (index === -1) return false;

  const proximos = [...anuncios];
  proximos[index] = {
    ...proximos[index],
    status: novoStatus,
    atualizadoEm: new Date().toISOString(),
  };

  saveAnuncios(proximos);
  return true;
}

export function isOwner(anuncio, usuarioId) {
  if (!anuncio || isBlank(usuarioId)) return false;
  return String(anuncio.usuarioId) === String(usuarioId);
}

export function formatPreco(preco, negociavel = false) {
  if (isBlank(preco)) return negociavel ? "A combinar" : "Sob consulta";

  const valor = Number(preco);
  if (!Number.isFinite(valor)) return negociavel ? "A combinar" : "Sob consulta";

  const formatado = valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return negociavel ? `${formatado} (negociável)` : formatado;
}

export function formatData(value) {
  if (isBlank(value)) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
