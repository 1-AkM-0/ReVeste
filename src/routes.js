export const ROUTES = Object.freeze({
  home: "/",
  explorar: "/explorar",
  login: "/login",
  cadastro: "/cadastro",
  perfil: "/perfil",
  garagem: "/garagem",
  criarAnuncio: "/anuncios/novo",
  novoAnuncio: "/anuncios/novo",
  anuncioDetalhe: "/anuncios/:id",
  detalheAnuncio: "/anuncios/:id",
  editarAnuncio: "/anuncios/:id/editar",
});

export function anuncioPath(id) {
  return `/anuncios/${id}`;
}

export function editarAnuncioPath(id) {
  return `/anuncios/${id}/editar`;
}
