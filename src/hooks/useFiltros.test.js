import { aplicarFiltros } from "./useFiltros";

const anuncios = [
  {
    id: "1",
    titulo: "Jaqueta jeans",
    categoria: "produto",
    preco: "",
    cidade: "Crato",
    criadoEm: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    titulo: "Vestido verde",
    categoria: "produto",
    preco: 25,
    cidade: "Juazeiro do Norte",
    criadoEm: "2026-01-03T00:00:00.000Z",
  },
  {
    id: "3",
    titulo: "Costura sob medida",
    categoria: "servico",
    modalidade: "presencial",
    preco: 15,
    cidade: "Barbalha",
    criadoEm: "2026-01-02T00:00:00.000Z",
  },
];

test("ordena anúncios sem preço por último no menor preço", () => {
  const resultado = aplicarFiltros(anuncios, { ordem: "menor_preco" });

  expect(resultado.map((anuncio) => anuncio.id)).toEqual(["3", "2", "1"]);
});

test("filtra por categoria e modalidade", () => {
  const resultado = aplicarFiltros(anuncios, {
    categoria: "servico",
    modalidade: "presencial",
  });

  expect(resultado.map((anuncio) => anuncio.id)).toEqual(["3"]);
});

test("busca tolera acentos e campos ausentes", () => {
  const resultado = aplicarFiltros([...anuncios, { id: "4" }], { busca: "juazeiro" });

  expect(resultado.map((anuncio) => anuncio.id)).toEqual(["2"]);
});
