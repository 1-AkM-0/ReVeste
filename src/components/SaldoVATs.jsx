function SaldoVATs({ saldo = 0, onComprar, onTrocar }) {
  return (
    <article className="saldo-card">
      <span>Saldo disponivel</span>
      <strong>{saldo} VATs</strong>
      <p>Use VATs para complementar trocas, negociar pecas e simular compra/venda no projeto.</p>

      <div className="saldo-actions">
        <button type="button" onClick={() => onComprar?.(25)}>
          Comprar +25
        </button>
        <button type="button" className="ghost-button" onClick={() => onTrocar?.(10)}>
          Trocar -10
        </button>
      </div>
    </article>
  );
}

export default SaldoVATs;
