import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { obterMovVATs } from './GraficoVATs';

function SaldoVATs({ saldo = 0, onComprar, onTrocar }) {
  const { usuario } = useAuth();

  const historico = useMemo(
    () => obterMovVATs(usuario?.id).slice(-8),
    [usuario?.id]
  );

  return (
    <article className="saldo-card">
      <span>Saldo disponível</span>
      <strong>{saldo} VATs</strong>

      <p>
        VATs são créditos virtuais usados para trocar, comprar e negociar peças dentro da comunidade Reveste.
      </p>

      <div className="saldo-actions">
        <button type="button" onClick={() => onComprar?.(25)}>
          Comprar +25
        </button>

        <button
          type="button"
          className="ghost-button"
          onClick={() => onTrocar?.(10)}
        >
          Trocar -10
        </button>
      </div>

      {historico.length > 0 && (
        <div className="mini-chart">
          <h4>Evolução recente</h4>
          {historico.map((h) => (
            <i
              key={h.id}
              style={{
                height: `${Math.min(100, 20 + Math.abs(h.amount) * 2)}%`,
              }}
              title={`${h.amount > 0 ? '+' : ''}${h.amount} VATs`}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default SaldoVATs;
