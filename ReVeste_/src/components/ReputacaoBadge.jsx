import React from 'react';
import '../styles/reputacao.css';

const ReputacaoBadge = ({ nota, totalNegociacoes }) => {
  return (
    <div className="badge-container">
      <span className="badge-nota">{nota}</span>
      <span className="badge-estrela">★</span>
      <span className="badge-texto">({totalNegociacoes} negociações)</span>
    </div>
  );
};

export default ReputacaoBadge;