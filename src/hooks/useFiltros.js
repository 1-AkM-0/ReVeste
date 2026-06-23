import { useCallback, useMemo, useState } from "react";
import { buscarAnuncios } from "../utils/search";
import { isBlank } from "../utils/validations";

export const FILTROS_PADRAO = {
  busca: "",
  categoria: "",
  tamanho: "",
  modalidade: "",
  vat: "",
  ordem: "recente",
};

function precoOrdenavel(preco, fallback) {
  if (isBlank(preco)) return fallback;

  const valor = Number(preco);
  return Number.isFinite(valor) ? valor : fallback;
}

function dataOrdenavel(data) {
  const timestamp = new Date(data ?? 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function aplicarFiltros(anuncios = [], filtros = FILTROS_PADRAO) {
  const filtrosAtuais = { ...FILTROS_PADRAO, ...filtros };
  let lista = buscarAnuncios(anuncios, filtrosAtuais.busca);

  if (filtrosAtuais.categoria) {
    lista = lista.filter((anuncio) => anuncio.categoria === filtrosAtuais.categoria);
  }

  if (filtrosAtuais.tamanho) {
    lista = lista.filter((anuncio) => anuncio.tamanho === filtrosAtuais.tamanho);
  }

  if (filtrosAtuais.modalidade) {
    lista = lista.filter((anuncio) => anuncio.modalidade === filtrosAtuais.modalidade);
  }

  if (filtrosAtuais.vat === "com_vat") {
    lista = lista.filter((anuncio) => anuncio.vat === true);
  } else if (filtrosAtuais.vat === "sem_vat") {
    lista = lista.filter((anuncio) => anuncio.vat !== true);
  }

  if (filtrosAtuais.busca.trim()) {
    return lista;
  }

  if (filtrosAtuais.ordem === "menor_preco") {
    return [...lista].sort(
      (a, b) => precoOrdenavel(a.preco, Infinity) - precoOrdenavel(b.preco, Infinity),
    );
  }

  if (filtrosAtuais.ordem === "maior_preco") {
    return [...lista].sort(
      (a, b) => precoOrdenavel(b.preco, -Infinity) - precoOrdenavel(a.preco, -Infinity),
    );
  }

  return [...lista].sort((a, b) => dataOrdenavel(b.criadoEm) - dataOrdenavel(a.criadoEm));
}

export function useFiltros(anuncios = []) {
  const [filtros, setFiltros] = useState(FILTROS_PADRAO);

  const setFiltro = useCallback((campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const limpar = useCallback(() => {
    setFiltros(FILTROS_PADRAO);
  }, []);

  const limparBusca = useCallback(() => {
    setFiltros((prev) => ({ ...prev, busca: "" }));
  }, []);

  const resultado = useMemo(
    () => aplicarFiltros(anuncios, filtros),
    [anuncios, filtros],
  );

  const quantidadeFiltrosAtivos = useMemo(() => {
    return [
      filtros.busca,
      filtros.categoria,
      filtros.tamanho,
      filtros.modalidade,
      filtros.vat,
    ].filter(Boolean).length;
  }, [filtros]);

  const temFiltrosAtivos = quantidadeFiltrosAtivos > 0;

  return {
    filtros,
    setFiltro,
    limpar,
    limparBusca,
    resultado,
    total: resultado.length,
    temFiltrosAtivos,
    quantidadeFiltrosAtivos,
  };
}
