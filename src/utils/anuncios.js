export const atualizarStatusAnuncio = (anuncioId, novoStatus) => {
  const dados = localStorage.getItem('reveste_anuncios');
  if (!dados) return;

  let anuncios = JSON.parse(dados);
  anuncios = anuncios.map(anuncio => 
    anuncio.id === anuncioId ? { ...anuncio, status: novoStatus } : anuncio
  );

  localStorage.setItem('reveste_anuncios', JSON.stringify(anuncios));
};