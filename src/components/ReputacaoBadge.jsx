import React, { useEffect, useState } from 'react';
import { calcularReputacao } from '../utils/avaliacoes';

const ReputacaoBadge = ({ usuarioId }) => {
  const [reputacao, setReputacao] = useState({ media: 0, total: 0 });

  useEffect(() => {
    if (usuarioId) {
      const stats = calcularReputacao(usuarioId);
      setReputacao(stats);
    }
  }, [usuarioId]);

  return (
    <div style={badgeContainerStyle}>
      <div style={statStyle}>
        <span style={valorStyle}>⭐ {reputacao.media}</span>
        <span style={labelStyle}>Média de Avaliações</span>
      </div>
      
      <div style={divisorStyle}></div>
      
      <div style={statStyle}>
        <span style={valorStyle}>🤝 {reputacao.total}</span>
        <span style={labelStyle}>Trocas Concluídas</span>
      </div>
    </div>
  );
};

// Estilos usando a paleta do index.css
const badgeContainerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.5rem',
  backgroundColor: '#f7f7f2',
  padding: '1rem 1.5rem',
  borderRadius: '0.5rem',
  border: '1px solid #d9ded8'
};

const statStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.25rem'
};

const valorStyle = {
  color: '#16382c',
  fontWeight: '800',
  fontSize: '1.25rem'
};

const labelStyle = {
  color: '#1f2933',
  fontSize: '0.85rem',
  fontWeight: '700'
};

const divisorStyle = {
  width: '1px',
  height: '40px',
  backgroundColor: '#d9ded8'
};

export default ReputacaoBadge;