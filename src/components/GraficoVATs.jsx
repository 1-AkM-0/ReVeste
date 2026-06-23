import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const CHAVE_HISTORICO = 'reveste_vats_historico';

export function registrarSaldoVATs(usuarioId, saldo) {
  if (!usuarioId) return;
  const chave = `${CHAVE_HISTORICO}_${usuarioId}`;
  const historico = JSON.parse(localStorage.getItem(chave) || '[]');
  const hoje = new Date().toISOString().slice(0, 10);
  if (historico.length > 0 && historico[historico.length - 1].data === hoje) {
    historico[historico.length - 1].saldo = saldo;
  } else {
    historico.push({ data: hoje, saldo });
  }
  if (historico.length > 60) historico.splice(0, historico.length - 60);
  localStorage.setItem(chave, JSON.stringify(historico));
}

export default function GraficoVATs() {
  const { usuario } = useAuth();

  const dados = useMemo(() => {
    if (!usuario?.id) return [];
    const chave = `${CHAVE_HISTORICO}_${usuario.id}`;
    return JSON.parse(localStorage.getItem(chave) || '[]').slice(-10);
  }, [usuario?.id]);

  if (dados.length < 2) {
    return (
      <article className="profile-card wide-card">
        <h2>Evolução de VATs</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Complete algumas negociações para ver seu histórico.
        </p>
      </article>
    );
  }

  const maxSaldo = Math.max(...dados.map((d) => d.saldo), 1);
  const minSaldo = Math.min(...dados.map((d) => d.saldo), 0);
  const amplitude = Math.max(maxSaldo - minSaldo, 1);
  const largura = 400;
  const altura = 160;
  const padding = { top: 12, right: 8, bottom: 28, left: 8 };
  const chartW = largura - padding.left - padding.right;
  const chartH = altura - padding.top - padding.bottom;

  return (
    <article className="profile-card wide-card">
      <h2>Evolução de VATs</h2>
      <svg viewBox={`0 0 ${largura} ${altura}`} style={{ width: '100%', maxHeight: '180px', display: 'block' }}>
        <defs>
          <linearGradient id="vatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {dados.map((ponto, i) => {
          const x = padding.left + (i / Math.max(dados.length - 1, 1)) * chartW;
          const y = padding.top + (1 - (ponto.saldo - minSaldo) / amplitude) * chartH;
          const barW = Math.max(16, chartW / dados.length * 0.6);
          const barH = chartH - y + padding.top;

          return (
            <g key={i}>
              <rect
                x={x - barW / 2}
                y={y}
                width={barW}
                height={barH}
                fill="var(--brand)"
                rx="4"
                opacity="0.75"
              >
                <title>{ponto.saldo} VATs em {ponto.data}</title>
              </rect>
              <text
                x={x}
                y={altura - 4}
                textAnchor="middle"
                fontSize="9"
                fill="var(--muted)"
              >
                {ponto.data.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
    </article>
  );
}