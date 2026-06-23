export const criarProposta = ({
    anuncioId,
    compradorId,
    vendedorId,
    tipo,
    valorOfertado = 0,
    itensTroca = [],
    vatsComplementar = 0
}) => {
    return {
        id: Date.now(),
        anuncioId,
        compradorId,
        vendedorId,
        tipo,
        status: "pendente",
        valorOfertado,
        itensTroca,
        vatsComplementar,
        historico: [
            {
                tipo: "proposta",
                data: new Date().toISOString()
            }
        ]
    }
}