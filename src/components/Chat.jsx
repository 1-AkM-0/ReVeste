import React, { useMemo, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { calcExpiracao } from '../utils/chat';
import ChatHeader from './ChatHeader';
import '../styles/chat.css';

const Chat = ({ negociacaoId, usuarioAtualId, onEncerrar, canEncerrar = true, dataEncerramento }) => {
  const { mensagens, enviarMensagem } = useChat(negociacaoId);
  const [novoTexto, setNovoTexto] = useState('');

  const { expirado, dataExpiracao } = useMemo(
    () => calcExpiracao(dataEncerramento),
    [dataEncerramento]
  );

  const handleEnviar = (e) => {
    e.preventDefault();
    if (expirado) {
      alert('Este chat foi encerrado há mais de 7 dias e não aceita novas mensagens.');
      return;
    }
    if (novoTexto.trim() === '') return;
    enviarMensagem(usuarioAtualId, novoTexto);
    setNovoTexto('');
  };

  return (
    <div className="chat-container">
      <ChatHeader onEncerrar={onEncerrar} canEncerrar={canEncerrar && !expirado} />
      
      {expirado && (
        <p style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.85rem", color: "var(--muted)", background: "var(--surface-soft)" }}>
          Chat expirado em {new Date(dataExpiracao).toLocaleDateString("pt-BR")}. Não é possível enviar novas mensagens.
        </p>
      )}

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
            placeholder={expirado ? "Chat expirado" : "Digite sua mensagem..."} 
            disabled={expirado}
            className="chat-input"
          />
          <button type="submit" className="chat-btn-enviar" disabled={expirado}>Enviar</button>
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
