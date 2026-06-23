import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import ChatHeader from './ChatHeader';
import '../styles/chat.css';

const Chat = ({ negociacaoId, usuarioAtualId, onEncerrar, canEncerrar = true }) => {
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
      <ChatHeader onEncerrar={onEncerrar} canEncerrar={canEncerrar} />
      
      <div className="chat-historico">
        {mensagens.length === 0 && (
          <p className="chat-vazio">Nenhuma mensagem enviada ainda.</p>
        )}

        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`chat-linha-msg${String(msg.remetenteId) === String(usuarioAtualId) ? ' propria' : ''}`}
          >
            <div className="chat-balao">
              <span className="chat-texto">{msg.texto}</span>
              <span className="chat-hora">{formatHora(msg.dataHora)}</span>
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

function formatHora(dataHora) {
  if (!dataHora) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dataHora));
}

export default Chat;
