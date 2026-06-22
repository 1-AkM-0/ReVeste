import { useState, useEffect } from 'react';

export const useAvaliacao = (usuarioAvaliadoId) => {
  const [avaliacoes, setAvaliacoes] = useState([]);

  // Carrega as avaliações do usuário ao montar o componente
  useEffect(() => {
    if (!usuarioAvaliadoId) return;
    const dados = localStorage.getItem(`reveste_avaliacoes_${usuarioAvaliadoId}`);
    if (dados) {
      setAvaliacoes(JSON.parse(dados));
    }
  }, [usuarioAvaliadoId]);

  // Função para salvar a nova avaliação
  const salvarAvaliacao = (nota, comentario, avaliadorId) => {
    const novaAvaliacao = {
      id: Date.now().toString(),
      avaliadorId,
      nota,
      comentario,
      data: new Date().toISOString()
    };

    const novasAvaliacoes = [...avaliacoes, novaAvaliacao];
    setAvaliacoes(novasAvaliacoes);
    localStorage.setItem(`reveste_avaliacoes_${usuarioAvaliadoId}`, JSON.stringify(novasAvaliacoes));
  };

  return { avaliacoes, salvarAvaliacao };
};