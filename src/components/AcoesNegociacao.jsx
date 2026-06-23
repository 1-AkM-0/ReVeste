import { useNegociacao } from "../context/NegociacaoContext"

export default function AcoesNegociacao({id, status, onAceitar, onRecusar}) {

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
    <div className="negociacao-acoes">
      <button className="btn btn-primary" onClick={() => (onAceitar ?? aceitar)(id)}>Aceitar</button>

      <button className="btn btn-ghost" onClick={() => (onRecusar ?? recusar)(id)}>Recusar</button>
    </div>
  )
}
