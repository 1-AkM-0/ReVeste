import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGaragem } from '../hooks/useGaragem';
import { ROUTES } from '../routes';

const Garagem = () => {
  const { usuario } = useAuth();
  const { garagem, moverItem } = useGaragem(usuario?.id);

  if (!usuario) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: 'var(--brand-dark)', marginBottom: '2rem', textAlign: 'center', fontWeight: '800' }}>Minha Garagem Virtual</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Lista: Disponível */}
        <div style={colunaStyle}>
          <h2 style={tituloListaStyle}>Disponível</h2>
          {garagem.disponivel.length === 0 ? <p style={textoVazioStyle}>Nenhum item disponível.</p> : (
            garagem.disponivel.map(item => (
              <div key={item.id} style={cardStyle}>
                <p style={itemTituloStyle}>{item.titulo}</p>
                <button onClick={() => moverItem(item.id, 'disponivel', 'negociacao')} style={btnVerde}>
                  Ir para Negociação
                </button>
              </div>
            ))
          )}
        </div>

        {/* Lista: Em Negociação */}
        <div style={colunaStyle}>
          <h2 style={tituloListaStyle}>Em Negociação</h2>
          {garagem.negociacao.length === 0 ? <p style={textoVazioStyle}>Nenhuma negociação rolando.</p> : (
            garagem.negociacao.map(item => (
              <div key={item.id} style={cardStyle}>
                <p style={itemTituloStyle}>{item.titulo}</p>
                <button onClick={() => moverItem(item.id, 'negociacao', 'concluido')} style={btnVerde}>
                  Marcar como Vendido/Trocado
                </button>
                <button onClick={() => moverItem(item.id, 'negociacao', 'disponivel')} style={btnCinza}>
                  Cancelar Negociação
                </button>
              </div>
            ))
          )}
        </div>

        {/* Lista: Concluído */}
        <div style={colunaStyle}>
          <h2 style={tituloListaStyle}>Trocado/Vendido</h2>
          {garagem.concluido.length === 0 ? <p style={textoVazioStyle}>Histórico vazio.</p> : (
            garagem.concluido.map(item => (
              <div key={item.id} style={{ ...cardStyle, opacity: 0.7, border: 'none', backgroundColor: 'var(--surface-soft)' }}>
                <p style={itemTituloStyle}>{item.titulo}</p>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-dark)', fontWeight: '700' }}>Negociação Concluída</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

// Estilos baseados no index.css
const colunaStyle = {
  flex: '1',
  minWidth: '280px',
  backgroundColor: 'var(--surface)',
  padding: '1.5rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--border)',
};

const tituloListaStyle = {
  fontSize: '1.25rem',
  color: 'var(--brand-dark)',
  borderBottom: '2px solid var(--brand)',
  paddingBottom: '0.5rem',
  marginBottom: '1.5rem',
  fontWeight: '800'
};

const textoVazioStyle = {
  color: 'var(--text)',
  opacity: 0.7
};

const cardStyle = {
  border: '1px solid var(--border)',
  padding: '1rem',
  borderRadius: '0.5rem',
  marginBottom: '1rem',
  backgroundColor: 'var(--surface-soft)'
};

const itemTituloStyle = {
  color: 'var(--text)',
  fontWeight: '700',
  margin: '0 0 0.5rem 0'
};

const btnVerde = {
  backgroundColor: 'var(--brand)',
  color: '#ffffff',
  border: 'none',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  width: '100%',
  fontWeight: '700',
  marginTop: '0.5rem'
};

const btnCinza = {
  backgroundColor: 'var(--surface-soft)',
  color: 'var(--text)',
  border: 'none',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  width: '100%',
  fontWeight: '700',
  marginTop: '0.5rem'
};

export default Garagem;
