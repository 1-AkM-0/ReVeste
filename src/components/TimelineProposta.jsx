export default function TimelineProposta({historico}) {

    return(
        <div>
            {historico.map(
                (item,index)=>(
                    <div key={index}>
                        <p>{item.data}</p>
                        
                        <p>{item.tipo}</p>
                    </div>
                    )
                )
            }
        </div>
    )
}