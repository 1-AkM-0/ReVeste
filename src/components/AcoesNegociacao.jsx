import { useNegociacao } from "../context/NegociacaoContext"

export default function AcoesNegociacao({id, status, onAceitar, onRecusar, onContrapor}) {

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

      {onContrapor && (
        <button className="btn btn-secondary" onClick={() => onContrapor(id)}>Contrapor</button>
      )}
    </div>
  )
}
