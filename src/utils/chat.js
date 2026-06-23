// Função para calcular se o chat já passou dos 7 dias após o encerramento
export const calcExpiracao = (dataEncerramento) => {
  if (!dataEncerramento) return { expirado: false };

  const inicio = new Date(dataEncerramento);
  const limite = new Date(inicio);
  
  // Adiciona 7 dias exatos à data de encerramento
  limite.setDate(limite.getDate() + 7);

  const hoje = new Date();
  const expirado = hoje > limite;

  return {
    expirado,
    dataExpiracao: limite.toISOString()
  };
};