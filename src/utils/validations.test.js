import { sanitizeAnuncioForm, validateAnuncioForm } from "./validations";

const anuncioValido = {
  titulo: "Jaqueta jeans",
  categoria: "produto",
  descricao: "Jaqueta em ótimo estado.",
  contato: "(88) 99999-0000",
  cidade: "Juazeiro do Norte",
  estado: "CE",
};

test("valida campos obrigatórios do anúncio", () => {
  const errors = validateAnuncioForm({});

  expect(errors).toMatchObject({
    titulo: "Informe um título.",
    categoria: "Selecione uma categoria.",
    descricao: "Descreva o anúncio.",
    contato: "Informe um contato.",
    cidade: "Informe a cidade.",
    estado: "Selecione o estado.",
  });
});

test("rejeita URL de foto inválida", () => {
  const errors = validateAnuncioForm({
    ...anuncioValido,
    fotoUrl: "foto-invalida",
  });

  expect(errors.fotoUrl).toBe("Informe uma URL de imagem válida.");
});

test("inclui URL de foto válida no payload normalizado", () => {
  const payload = sanitizeAnuncioForm({
    ...anuncioValido,
    fotoUrl: "https://example.com/foto.jpg",
  });

  expect(payload.imagens).toEqual(["https://example.com/foto.jpg"]);
});
