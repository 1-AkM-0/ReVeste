import React from 'react';

const ChatHeader = ({ onEncerrar }) => {
  return (
    <div style={headerStyle}>
      <h3 style={tituloStyle}>Chat da Negociação</h3>
      <button onClick={onEncerrar} style={btnEncerrarStyle}>
        Encerrar Negociação
      </button>
    </div>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #e5e5e5',
  padding: '1rem',
  backgroundColor: '#fff',
  borderRadius: '6px 6px 0 0'
};

const tituloStyle = {
  margin: 0,
  color: '#16382c',
  fontSize: '1rem',
  fontWeight: 'bold'
};

const btnEncerrarStyle = {
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #000',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.8rem'
};

export default ChatHeader;