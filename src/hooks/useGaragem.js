import { useState, useEffect } from 'react';
import {
  buscarGaragem,
  estadoGaragemInicial,
  itemGaragemFromAnuncio,
  moverItemGaragem,
  salvarGaragem,
  sincronizarGaragemAnuncio,
} from '../utils/garagem';

export const useGaragem = (usuarioLogadoId) => {
  const [garagem, setGaragem] = useState({
    disponivel: [],
    negociacao: [],
    concluido: []
  });

  useEffect(() => {
    if (!usuarioLogadoId) {
      setGaragem(estadoGaragemInicial());
      return;
    }

    const garagemAtual = buscarGaragem(usuarioLogadoId);
    salvarGaragem(usuarioLogadoId, garagemAtual);
    setGaragem(garagemAtual);
  }, [usuarioLogadoId]);

  const moverItem = (itemId, listaOrigem, listaDestino) => {
    if (!usuarioLogadoId) return;

    const itemParaMover = garagem[listaOrigem].find(item => item.id === itemId);
    if (!itemParaMover) return;

    const novaGaragem = moverItemGaragem(usuarioLogadoId, itemParaMover, listaDestino);
    setGaragem(novaGaragem);

    sincronizarGaragemAnuncio(
      {
        ...itemGaragemFromAnuncio(itemParaMover),
        usuarioId: usuarioLogadoId,
      },
      listaDestino
    );
  };

  return { garagem, moverItem };
};
