import { useState, useMemo, useCallback } from "react";
import { buscarAnuncios } from "../utils/search";

export const FILTROS_PADRAO = {
  busca:      "",
  categoria:  "",       
  tamanho:    "",     
  modalidade: "",      
  vat:        "",       
  ordem:      "recente", 
};

function aplicarFiltros(anuncios, filtros) {
  let lista = buscarAnuncios(anuncios, filtros.busca);

  if (filtros.categoria) {
    lista = lista.filter((a) => a.categoria === filtros.categoria);
  }

  if (filtros.tamanho) {
    lista = lista.filter((a) => a.tamanho === filtros.tamanho);
  }

  if (filtros.modalidade) {
    lista = lista.filter((a) => a.modalidade === filtros.modalidade);
  }

  if (filtros.vat === "com_vat") {
    lista = lista.filter((a) => a.vat === true);
  } else if (filtros.vat === "sem_vat") {
    lista = lista.filter((a) => !a.vat);
  }

  if (!filtros.busca.trim()) {
    if (filtros.ordem === "menor_preco") {
      lista = [...lista].sort((a, b) => (a.preco ?? Infinity) - (b.preco ?? Infinity));
    } else if (filtros.ordem === "maior_preco") {
      lista = [...lista].sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0));
    }
  }

  return lista;
}
  @param {Array} anuncios - lista bruta vinda da API
  @returns {{
    filtros: object,
    setFiltro: (campo, valor) => void,
    limpar: () => void,
    limparBusca: () => void,
    resultado: Array,
    total: number,
    temFiltrosAtivos: boolean,
    quantidadeFiltrosAtivos: number,
   }}

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
    [anuncios, filtros]
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
