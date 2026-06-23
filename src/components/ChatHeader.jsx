import React from 'react';

const ChatHeader = ({ onEncerrar, canEncerrar = true }) => {
  return (
    <div className="chat-header">
      <h3>Chat da Negociação</h3>
      {canEncerrar && (
        <button type="button" onClick={onEncerrar} className="btn btn-ghost btn-sm">
          Encerrar Negociação
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
