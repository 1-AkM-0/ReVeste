import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';

const Chat = ({ negociacaoId, usuarioAtualId, onEncerrar }) => {
  const { mensagens, enviarMensagem } = useChat(negociacaoId);
  const [novoTexto, setNovoTexto] = useState('');

  const handleEnviar = (e) => {
    e.preventDefault();
    if (novoTexto.trim() === '') return;
    enviarMensagem(usuarioAtualId, novoTexto);
    setNovoTexto('');
  };

  return (
    <div style={chatContainerStyle}>
      <div style={headerStyle}>
        <h3 style={tituloStyle}>Chat da Negociação</h3>
        <button onClick={onEncerrar} style={btnEncerrarStyle}>
          Encerrar Negociação
        </button>
      </div>

      <div style={mensagensAreaStyle}>
        {mensagens.length === 0 ? (
          <p style={textoVazioStyle}>Envie a primeira mensagem para combinar a troca.</p>
        ) : null}
        
        {mensagens.map((msg) => {
          const isMinha = msg.remetenteId === usuarioAtualId;
          return (
            <div key={msg.id} style={{
              ...balaoStyle,
              alignSelf: isMinha ? 'flex-end' : 'flex-start',
              backgroundColor: isMinha ? '#176b4d' : '#d9ded8',
              color: isMinha ? '#ffffff' : '#1f2933'
            }}>
              <p style={{ margin: 0 }}>{msg.texto}</p>
              <small style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '4px' }}>
                {new Date(msg.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleEnviar} style={formStyle}>
        <input
          type="text"
          value={novoTexto}
          onChange={(e) => setNovoTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={inputStyle}
        />
        <button type="submit" style={btnEnviarStyle}>Enviar</button>
      </form>
    </div>
  );
};

// Estilos alinhados com o index.css
const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '450px',
  border: '1px solid #d9ded8',
  borderRadius: '0.5rem',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
  maxWidth: '600px',
  margin: '0 auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  borderBottom: '1px solid #d9ded8',
  backgroundColor: '#f7f7f2'
};

const tituloStyle = {
  margin: 0,
  color: '#16382c',
  fontSize: '1.1rem',
  fontWeight: '800'
};

const mensagensAreaStyle = {
  flex: 1,
  padding: '1rem',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  backgroundColor: '#fafaf9'
};

const textoVazioStyle = {
  textAlign: 'center',
  color: '#1f2933',
  opacity: 0.7,
  marginTop: '2rem'
};

const balaoStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  maxWidth: '75%',
  display: 'flex',
  flexDirection: 'column'
};

const formStyle = {
  display: 'flex',
  padding: '1rem',
  borderTop: '1px solid #d9ded8',
  backgroundColor: '#f7f7f2',
  gap: '0.5rem'
};

const inputStyle = {
  flex: 1,
  padding: '0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid #d9ded8',
  outline: 'none',
  fontFamily: 'inherit'
};

const btnEnviarStyle = {
  backgroundColor: '#176b4d',
  color: '#ffffff',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: '700'
};

const btnEncerrarStyle = {
  backgroundColor: 'transparent',
  color: '#1f2933',
  border: '1px solid #d9ded8',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.85rem'
};

export default Chat;