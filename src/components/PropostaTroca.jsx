import {useState} from "react"

export default function PropostaTroca({minhasPecas = [], onChange}){

    const [selecionadas, setSelecionadas] = useState([])
    const [vats, setVats] = useState(0)

    function togglePeca(peca){
        const jaSelecionada = selecionadas.find(s => s.id === peca.id)
        let novas
        if(jaSelecionada){
            novas = selecionadas.filter(s => s.id !== peca.id)
        } else if(selecionadas.length < 5){
            novas = [...selecionadas, peca]
        } else {
            return
        }
        setSelecionadas(novas)
        onChange?.({itensTroca: novas, vatsComplementar: Number(vats)})
    }

    function handleVats(valor){
        setVats(valor)
        onChange?.({itensTroca: selecionadas, vatsComplementar: Number(valor)})
    }

    return(
        <div>
            <h3>Troca</h3>
            <p>Selecione de 1 a 5 peças suas para oferecer na troca:</p>

            {minhasPecas.length === 0 ? (
                <p>Você não possui peças disponíveis para troca.</p>
            ) : (
                <div>
                    {minhasPecas.map(peca => (
                        <label key={peca.id} style={{display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "0.5rem", cursor: "pointer"}}>
                            <input
                                type="checkbox"
                                checked={!!selecionadas.find(s => s.id === peca.id)}
                                onChange={() => togglePeca(peca)}
                            />
                            <span>{peca.titulo}</span>
                        </label>
                    ))}
                </div>
            )}

            <p style={{marginTop: "0.5rem"}}>Peças selecionadas: {selecionadas.length}/5</p>

            <input
                type="number"
                placeholder="VAT complementar (opcional)"
                value={vats}
                min={0}
                onChange={e => handleVats(e.target.value)}
                style={{marginTop: "0.5rem", width: "100%", padding: "0.5rem"}}
            />
        </div>
    )
}
