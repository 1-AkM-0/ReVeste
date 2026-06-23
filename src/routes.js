export const ROUTES = Object.freeze({
  home: "/",
  explorar: "/explorar",
  criarAnuncio: "/anuncios/novo",
  anuncioDetalhe: "/anuncios/:id",
  editarAnuncio: "/anuncios/:id/editar",
});

export function anuncioPath(id) {
  return `/anuncios/${id}`;
}

export function editarAnuncioPath(id) {
  return `/anuncios/${id}/editar`;
}
