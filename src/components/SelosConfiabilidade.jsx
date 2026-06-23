import { useMemo } from 'react';
import { calcularReputacao } from '../utils/avaliacoes';

const SELOS = [
  {
    id: 'super-confiavel',
    label: 'Super Confiável',
    descricao: 'Média de avaliações acima de 9',
    icone: '⭐⭐',
    condicao: (stats) => stats.media >= 9 && stats.total >= 1,
  },
  {
    id: 'confiavel',
    label: 'Confiável',
    descricao: 'Média de avaliações acima de 8',
    icone: '⭐',
    condicao: (stats) => stats.media >= 8 && stats.total >= 1,
  },
  {
    id: 'veterano',
    label: 'Veterano',
    descricao: 'Mais de 15 negociações concluídas',
    icone: '🏆',
    condicao: (stats) => stats.total >= 15,
  },
  {
    id: 'experiente',
    label: 'Experiente',
    descricao: 'Mais de 5 negociações concluídas',
    icone: '💪',
    condicao: (stats) => stats.total >= 5,
  },
  {
    id: 'antigo',
    label: 'Antigo no ReVeste',
    descricao: 'Conta criada há mais de 1 ano',
    icone: '📅',
    condicao: (stats, desde) => {
      if (!desde) return false;
      const ano = Number(desde);
      if (Number.isNaN(ano)) return false;
      return new Date().getFullYear() - ano >= 1;
    },
  },
];

export default function SelosConfiabilidade({ usuarioId, desde, negociacoes }) {
  const stats = useMemo(() => calcularReputacao(usuarioId), [usuarioId]);

  const selosAtivos = useMemo(() => {
    return SELOS.filter((selo) => selo.condicao({ media: Number(stats.media), total: stats.total || Number(negociacoes || 0) }, desde));
  }, [stats, desde, negociacoes]);

  if (selosAtivos.length === 0) return null;

  return (
    <div className="selos-container">
      {selosAtivos.map((selo) => (
        <span key={selo.id} className="selo-badge" title={selo.descricao}>
          <span className="selo-icone">{selo.icone}</span>
          <span className="selo-label">{selo.label}</span>
        </span>
      ))}
    </div>
  );
}