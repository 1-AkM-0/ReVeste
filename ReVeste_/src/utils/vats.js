export function calcDiferenca(v1, v2){
    return Math.abs(v1-v2)/Math.max(v1,v2)
}

export function saoEquivalentes(v1,v2){
    return calcDiferenca(v1,v2)<=0.2
}

export function sugerirComplemento(v1,v2){
    if(v1>v2){
        return v1-v2
    }
    return 0
}