const KEY="propostas"

export function buscarPropostas(){
    return JSON.parse(
        localStorage.getItem(KEY)
    ) || []
}

export function salvarProposta(proposta){
    const lista=buscarPropostas()
    lista.push(proposta)
    localStorage.setItem(
        KEY,
        JSON.stringify(lista)
    )
}

export function atualizarProposta(id,dados){
    const lista=buscarPropostas()

    const novaLista=lista.map(p=>
        p.id===id ? {...p,...dados, atualizadoEm: new Date().toISOString()} : p
    )

    localStorage.setItem(
        KEY,
        JSON.stringify(novaLista)
    )
}
