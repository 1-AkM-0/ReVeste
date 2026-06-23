import { useState, useEffect } from 'react';
import { atualizarStatusAnuncio } from '../utils/anuncios';

export const useGaragem = (usuarioLogadoId) => {
  const [garagem, setGaragem] = useState({
    disponivel: [],
    negociacao: [],
    concluido: []
  });

  useEffect(() => {
    if (!usuarioLogadoId) {
      setGaragem({ disponivel: [], negociacao: [], concluido: [] });
      return;
    }

    const chaveStorage = `reveste_garagem_${usuarioLogadoId}`;
    const dadosLocais = localStorage.getItem(chaveStorage);

    try {
      if (dadosLocais) {
        setGaragem(JSON.parse(dadosLocais));
        return;
      }

      const estadoInicial = { disponivel: [], negociacao: [], concluido: [] };
      localStorage.setItem(chaveStorage, JSON.stringify(estadoInicial));
      setGaragem(estadoInicial);
    } catch {
      const estadoInicial = { disponivel: [], negociacao: [], concluido: [] };
      localStorage.setItem(chaveStorage, JSON.stringify(estadoInicial));
      setGaragem(estadoInicial);
    }
  }, [usuarioLogadoId]);

  const moverItem = (itemId, listaOrigem, listaDestino) => {
    if (!usuarioLogadoId) return;

    const itemParaMover = garagem[listaOrigem].find(item => item.id === itemId);
    if (!itemParaMover) return;

    const novaGaragem = {
      ...garagem,
      [listaOrigem]: garagem[listaOrigem].filter(item => item.id !== itemId),
      [listaDestino]: [...garagem[listaDestino], itemParaMover]
    };

    setGaragem(novaGaragem);
    localStorage.setItem(`reveste_garagem_${usuarioLogadoId}`, JSON.stringify(novaGaragem));

    // Sincroniza o banco de dados global de anúncios com a Garagem
    if (listaDestino === 'concluido') {
      atualizarStatusAnuncio(itemId, 'vendido'); 
    } else if (listaDestino === 'disponivel') {
      atualizarStatusAnuncio(itemId, 'ativo'); 
    } else if (listaDestino === 'negociacao') {
      atualizarStatusAnuncio(itemId, 'em_negociacao'); 
    }
  };

  return { garagem, moverItem };
};
