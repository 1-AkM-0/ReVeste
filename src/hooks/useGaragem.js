import { useState, useEffect } from 'react';

export const useGaragem = (usuarioLogadoId) => {
  const [garagem, setGaragem] = useState({
    disponivel: [],
    negociacao: [],
    concluido: []
  });

  // Carrega os dados da garagem salvos no localStorage
  useEffect(() => {
    if (!usuarioLogadoId) return;

    const chaveStorage = `reveste_garagem_${usuarioLogadoId}`;
    const dadosLocais = localStorage.getItem(chaveStorage);

    if (dadosLocais) {
      setGaragem(JSON.parse(dadosLocais));
    } else {
      // Cria a estrutura inicial caso o usuário seja novo
      const estadoInicial = { disponivel: [], negociacao: [], concluido: [] };
      localStorage.setItem(chaveStorage, JSON.stringify(estadoInicial));
      setGaragem(estadoInicial);
    }
  }, [usuarioLogadoId]);

  // Função para mover peças entre as 3 listas
  const moverItem = (itemId, listaOrigem, listaDestino) => {
    const itemParaMover = garagem[listaOrigem].find(item => item.id === itemId);
    if (!itemParaMover) return;

    const novaGaragem = {
      ...garagem,
      [listaOrigem]: garagem[listaOrigem].filter(item => item.id !== itemId),
      [listaDestino]: [...garagem[listaDestino], itemParaMover]
    };

    setGaragem(novaGaragem);
    localStorage.setItem(`reveste_garagem_${usuarioLogadoId}`, JSON.stringify(novaGaragem));
  };

  return { garagem, moverItem };
};