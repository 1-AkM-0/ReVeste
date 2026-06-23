import { useState, useEffect } from 'react';

export const useChat = (negociacaoId) => {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    if (!negociacaoId) return;
    
    const chatStorage = localStorage.getItem(`reveste_chat_${negociacaoId}`);
    if (chatStorage) {
      setMensagens(JSON.parse(chatStorage));
    }
  }, [negociacaoId]);

  const enviarMensagem = (remetenteId, texto) => {
    const novaMensagem = {
      id: Date.now().toString(),
      remetenteId,
      texto,
      dataHora: new Date().toISOString()
    };
    
    const novasMensagens = [...mensagens, novaMensagem];
    setMensagens(novasMensagens);
    localStorage.setItem(`reveste_chat_${negociacaoId}`, JSON.stringify(novasMensagens));
  };

  return { mensagens, enviarMensagem };
};