import {    sugerirComplemento  } from "../utils/vats"

export default function SugestaoVATs({valorAnuncio, valorOferta}) {

    const diferenca= sugerirComplemento(valorAnuncio, valorOferta)

    if(diferenca===0){
        return null
    }

    return(
        <p>
            Sugestão: Adicione {diferenca} VATs
        </p>
    )
}