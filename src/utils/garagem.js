import { atualizarStatusAnuncio } from "./anuncios";

const listas = ["disponivel", "negociacao", "concluido"];

export function estadoGaragemInicial() {
  return {
    disponivel: [],
    negociacao: [],
    concluido: [],
  };
}

export function garagemStorageKey(usuarioId) {
  return `reveste_garagem_${usuarioId}`;
}

export function buscarGaragem(usuarioId) {
  if (!usuarioId) return estadoGaragemInicial();

  const chaveStorage = garagemStorageKey(usuarioId);
  const dadosLocais = localStorage.getItem(chaveStorage);

  try {
    return dadosLocais ? normalizarGaragem(JSON.parse(dadosLocais)) : estadoGaragemInicial();
  } catch {
    return estadoGaragemInicial();
  }
}

export function salvarGaragem(usuarioId, garagem) {
  if (!usuarioId) return;
  localStorage.setItem(garagemStorageKey(usuarioId), JSON.stringify(normalizarGaragem(garagem)));
}

export function itemGaragemFromAnuncio(anuncio) {
  return {
    id: anuncio.id,
    titulo: anuncio.titulo,
  };
}

export function moverItemGaragem(usuarioId, item, listaDestino) {
  if (!usuarioId || !item?.id || !listas.includes(listaDestino)) return estadoGaragemInicial();

  const garagemAtual = buscarGaragem(usuarioId);
  const semItem = listas.reduce((acc, lista) => {
    acc[lista] = garagemAtual[lista].filter((garagemItem) => String(garagemItem.id) !== String(item.id));
    return acc;
  }, estadoGaragemInicial());

  const novaGaragem = {
    ...semItem,
    [listaDestino]: [...semItem[listaDestino], item],
  };

  salvarGaragem(usuarioId, novaGaragem);
  return novaGaragem;
}

export function removerItemGaragem(usuarioId, itemId) {
  if (!usuarioId || !itemId) return estadoGaragemInicial();

  const garagemAtual = buscarGaragem(usuarioId);
  const novaGaragem = listas.reduce((acc, lista) => {
    acc[lista] = garagemAtual[lista].filter((item) => String(item.id) !== String(itemId));
    return acc;
  }, estadoGaragemInicial());

  salvarGaragem(usuarioId, novaGaragem);
  return novaGaragem;
}

export function sincronizarGaragemAnuncio(anuncio, listaDestino) {
  if (!anuncio?.usuarioId) return;

  moverItemGaragem(anuncio.usuarioId, itemGaragemFromAnuncio(anuncio), listaDestino);

  const statusPorLista = {
    disponivel: "ativo",
    negociacao: "em_negociacao",
    concluido: "vendido",
  };

  atualizarStatusAnuncio(anuncio.id, statusPorLista[listaDestino] ?? "ativo");
}

function normalizarGaragem(garagem) {
  return listas.reduce((acc, lista) => {
    acc[lista] = Array.isArray(garagem?.[lista]) ? garagem[lista] : [];
    return acc;
  }, estadoGaragemInicial());
}
