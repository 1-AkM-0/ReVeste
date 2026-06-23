import React, { useState } from 'react';
import '../styles/avaliacao.css';

const Avaliacao = ({ onSubmit }) => {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ nota, comentario });
  };

  return (
    <div className="avaliacao-container">
      <h3 className="avaliacao-titulo">Avalie a Negociação</h3>
      <form onSubmit={handleSubmit}>
        <div className="avaliacao-estrelas">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <button
              key={estrela}
              type="button"
              className={`avaliacao-estrela-btn ${nota >= estrela ? 'ativa' : ''}`}
              onClick={() => setNota(estrela)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="avaliacao-textarea"
          placeholder="Deixe um comentário sobre a troca..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows="4"
        />
        <button type="submit" className="avaliacao-submit">
          Enviar Avaliação
        </button>
      </form>
    </div>
  );
};

export default Avaliacao;