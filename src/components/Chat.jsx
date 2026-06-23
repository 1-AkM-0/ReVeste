import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatHeader from './ChatHeader';
import '../styles/chat.css';

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
    <div className="chat-container">
      <ChatHeader onEncerrar={onEncerrar} />
      
      <div className="chat-historico">
        {mensagens.map((msg, index) => (
          <div key={index} className="chat-linha-msg">
            <div className="chat-balao">
              <span className="chat-texto">{msg.texto}</span>
              <span className="chat-hora">{msg.hora || '16:32'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-form-container">
        <form onSubmit={handleEnviar} className="chat-form">
          <input 
            type="text" 
            value={novoTexto} 
            onChange={(e) => setNovoTexto(e.target.value)} 
            placeholder="Digite sua mensagem..." 
            className="chat-input"
          />
          <button type="submit" className="chat-btn-enviar">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;