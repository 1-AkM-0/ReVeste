export const calcularReputacao = (usuarioId) => {
  const dados = localStorage.getItem(`reveste_avaliacoes_${usuarioId}`);
  if (!dados) return { media: 0, total: 0 };

  const avaliacoes = JSON.parse(dados);
  const total = avaliacoes.length;
  
  if (total === 0) return { media: 0, total: 0 };

  const soma = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
  const media = (soma / total).toFixed(1); // Formata para 1 casa decimal (ex: 9.5)

  return { media, total };
};