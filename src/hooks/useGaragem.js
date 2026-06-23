import { useState, useEffect } from 'react';
import {
  buscarGaragem,
  estadoGaragemInicial,
  itemGaragemFromAnuncio,
  moverItemGaragem,
  salvarGaragem,
  sincronizarGaragemAnuncio,
} from '../utils/garagem';
import { atualizarProposta, buscarPropostas } from '../utils/propostas';

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

    if (listaOrigem === "negociacao") {
      const propostas = buscarPropostas();
      const proposta = propostas.find(
        (p) => String(p.anuncioId) === String(itemId) && p.status === "pendente"
      );
      if (proposta) {
        if (listaDestino === "concluido") {
          atualizarProposta(proposta.id, { status: "aceita" });
        } else if (listaDestino === "disponivel") {
          atualizarProposta(proposta.id, { status: "encerrada" });
        }
      }
    }
  };

  return { garagem, moverItem };
};
