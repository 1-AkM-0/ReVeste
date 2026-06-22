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
  borderBottom: '1px solid #d9ded8',
  paddingBottom: '1rem',
  marginBottom: '1rem'
};

const tituloStyle = {
  margin: 0,
  color: '#16382c',
  fontSize: '1.1rem',
  fontWeight: 'bold'
};

const btnEncerrarStyle = {
  backgroundColor: '#f7f7f2',
  color: '#16382c',
  border: '1px solid #16382c',
  padding: '0.4rem 0.8rem',
  borderRadius: '0.4rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.85rem'
};

export default ChatHeader;