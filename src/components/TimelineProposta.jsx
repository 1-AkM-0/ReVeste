export default function TimelineProposta({historico}) {

    if(!historico || historico.length === 0){
        return <p>Nenhum histórico disponível.</p>
    }

    return(
        <div style={{borderLeft: "2px solid #456b55", paddingLeft: "1rem", marginLeft: "0.5rem"}}>
            {historico.map(
                (item,index)=>(
                    <div key={index} style={{marginBottom: "1rem", position: "relative"}}>
                        <div style={{width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.tipo === "contraproposta" ? "#f59e0b" : "#456b55", position: "absolute", left: "-1.55rem", top: "0.3rem"}}></div>
                        <p style={{fontWeight: "bold", margin: 0}}>
                            {item.tipo === "contraproposta" ? "Contraproposta" : "Proposta"}
                        </p>
                        <p style={{margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.85rem"}}>
                            {formatarData(item.data)}
                        </p>
                        {item.dados && (
                            <div style={{marginTop: "0.25rem", fontSize: "0.9rem"}}>
                                {item.dados.valorOfertado !== undefined && (
                                    <p style={{margin: 0}}>Valor: {item.dados.valorOfertado} VATs</p>
                                )}
                                {item.dados.itensTroca && item.dados.itensTroca.length > 0 && (
                                    <p style={{margin: 0}}>Itens: {item.dados.itensTroca.map(i => i.titulo).join(", ")}</p>
                                )}
                                {item.dados.vatsComplementar > 0 && (
                                    <p style={{margin: 0}}>VAT complementar: {item.dados.vatsComplementar}</p>
                                )}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    )
}

function formatarData(dataISO){
    if(!dataISO) return ""
    const d = new Date(dataISO)
    return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}
