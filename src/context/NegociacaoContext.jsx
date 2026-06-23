import {    createContext, useContext, useEffect, useState  } from "react"
import {    buscarPropostas, salvarProposta, atualizarProposta  } from "../utils/propostas"

const NegociacaoContext=createContext()

export function NegociacaoProvider({children}){

  const [propostas,setPropostas] = useState([])

  useEffect(()=>{
      setPropostas(
          buscarPropostas()
      )
    }, []
  )

  const criar=(proposta)=>{
      salvarProposta(proposta)

      setPropostas(
          buscarPropostas()
      )
  }

  const aceitar = (id) => {
    const proposta = propostas.find(p => p.id === id)

    if (!proposta) {
      return
    }

    if (proposta.status !== 'pendente') {
      return
    }

    atualizarProposta(
      id, {
        status: 'aceita'
      }
    )

    setPropostas(
      buscarPropostas()
    )
  }

  const recusar = (id) => {
    const proposta = propostas.find(p => p.id === id)

    if (!proposta) {
      return
    }

    if (proposta.status !== 'pendente') {
      return
    }

    atualizarProposta(
      id, {
        status: 'recusada'
      }
    )

    setPropostas(
      buscarPropostas()
    )
  }

  const encerrar = (id) => {
    const proposta = propostas.find(p => String(p.id) === String(id))

    if (!proposta) {
      return
    }

    atualizarProposta(
      id, {
        status: 'encerrada'
      }
    )

    setPropostas(
      buscarPropostas()
    )
  }

  return(

    <NegociacaoContext.Provider
      value={
        {
          propostas,
          criar,
          aceitar,
          recusar,
          encerrar
        }
      }
    >
    
    {children}

    </NegociacaoContext.Provider>
  )
}

export function useNegociacao(){
  return useContext(
    NegociacaoContext
  )
}
