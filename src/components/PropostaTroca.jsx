import {useState} from "react"

export default function PropostaTroca(){

    const [vats,setVats] = useState(0)

    return(
        <div>
            <h3>Troca</h3>

            <input
                type="number"
                placeholder="VAT complementar"
                value={vats}
                onChange={
                    e=>setVats(
                        e.target.value
                    )
                }
            />
        </div>
    )
}