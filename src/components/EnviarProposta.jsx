import {useState} from "react"
import {criarProposta} from "../utils/schemas"

import {useNegociacao} from "../context/NegociacaoContext"


export default function EnviarProposta({anuncio, usuario}) {

    const [valor,setValor]=useState("")
    const {criar}=useNegociacao()

    function enviar(){
        
        if(valor>anuncio.valor){
            alert(
                "Valor maior que o anunciado"
            )
        
            return
        }

        const proposta = criarProposta({
            anuncioId:anuncio.id,
            compradorId:usuario.id,
            vendedorId:anuncio.usuarioId,
            tipo:"venda",
            valorOfertado:Number(valor)
        })

        criar(proposta)

        alert("Proposta enviada")
    }

    return(
        <div>
            <input 
                type="number" 
                value={valor} 
                onChange={
                    e=>setValor(
                        e.target.value
                    )
                }
            />

            <button onClick={enviar}> Enviar </button>
        </div>
    )
}