function SaldoVATs({ saldo = 0, onComprar, onTrocar }) {
  return (
    <div className="saldo-card">
      <span>Saldo disponível</span>
      <strong>{saldo} VATs</strong>
      <p>Use VATs para complementar trocas, negociar peças e simular compra/venda no projeto.</p>
      <div className="saldo-actions">
        <button type="button" onClick={() => onComprar?.(25)}>Comprar +25</button>
        <button type="button" className="ghost-button" onClick={() => onTrocar?.(10)}>Trocar -10</button>
      </div>
    </div>
  )
}

export default SaldoVATs
