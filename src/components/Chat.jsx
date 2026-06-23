import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatHeader from './ChatHeader';

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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
      <ChatHeader onEncerrar={onEncerrar} />
      
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '1rem', padding: '0.5rem', background: '#f9f9f9' }}>
        {mensagens.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.enviadoPor === usuarioAtualId ? 'right' : 'left', margin: '0.5rem 0' }}>
            <span style={{ background: msg.enviadoPor === usuarioAtualId ? '#16382c' : '#e5e5e5', color: msg.enviadoPor === usuarioAtualId ? '#fff' : '#000', padding: '0.5rem', borderRadius: '8px' }}>
              {msg.texto}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleEnviar} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={novoTexto} 
          onChange={(e) => setNovoTexto(e.target.value)} 
          placeholder="Digite sua mensagem..." 
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#16382c', color: '#fff', border: 'none', borderRadius: '4px' }}>Enviar</button>
      </form>
    </div>
  );
};

export default Chat;