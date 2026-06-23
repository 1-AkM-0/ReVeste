import {useNegociacao}

from "../context/NegociacaoContext"

export default function AcoesNegociacao({id, status}) {

  const {aceitar, recusar} = useNegociacao()

  if (status !== 'pendente') {

    return (
      <p>
        Negociação encerrada:
        <strong>
          {' '}{status}
        </strong>
      </p>
    )
  }

  return (
    <div>
      <button onClick={() => aceitar(id)}>Aceitar</button>

      <button onClick={() => recusar(id)}>Recusar</button>
    </div>
  )
}