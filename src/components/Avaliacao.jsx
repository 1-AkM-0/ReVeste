import React, { useState } from 'react';
import { useAvaliacao } from '../hooks/useAvaliacao';

const Avaliacao = ({ usuarioAvaliadoId, avaliadorId, onConcluido }) => {
  const { salvarAvaliacao } = useAvaliacao(usuarioAvaliadoId);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação da nota obrigatória (1 a 10)
    if (nota < 1 || nota > 10) {
      alert('Por favor, selecione uma nota de 1 a 10.');
      return;
    }
    
    salvarAvaliacao(nota, comentario, avaliadorId);
    setSucesso(true);
    
    // Se o componente pai passar uma função para fechar a tela, chama após 2s
    if (onConcluido) {
      setTimeout(onConcluido, 2000);
    }
  };

  if (sucesso) {
    return (
      <div style={containerStyle}>
        <h3 style={{ color: '#176b4d', textAlign: 'center', margin: 0 }}>Avaliação enviada com sucesso!</h3>
        <p style={{ textAlign: 'center', color: '#1f2933', marginTop: '0.5rem' }}>Obrigado pelo seu feedback.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={tituloStyle}>Avaliar Usuário</h3>
      <p style={subtituloStyle}>Como foi a negociação? Dê uma nota de 1 a 10.</p>

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={notasContainerStyle}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setNota(num)}
              style={{
                ...notaBtnStyle,
                backgroundColor: nota >= num ? '#176b4d' : '#d9ded8',
                color: nota >= num ? '#ffffff' : '#1f2933'
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Deixe um comentário sobre a troca (opcional)"
          style={textareaStyle}
          rows="4"
        />

        <button type="submit" style={btnEnviarStyle}>
          Enviar Avaliação
        </button>
      </form>
    </div>
  );
};

// Estilos alinhados com o design system do projeto
const containerStyle = {
  padding: '1.5rem',
  border: '1px solid #d9ded8',
  borderRadius: '0.5rem',
  backgroundColor: '#ffffff',
  maxWidth: '500px',
  margin: '0 auto',
  fontFamily: 'inherit'
};

const tituloStyle = {
  color: '#16382c',
  margin: '0 0 0.5rem 0',
  fontWeight: '800',
  textAlign: 'center',
  fontSize: '1.25rem'
};

const subtituloStyle = {
  color: '#1f2933',
  textAlign: 'center',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
  opacity: 0.8
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const notasContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.25rem',
  flexWrap: 'wrap'
};

const notaBtnStyle = {
  flex: '1',
  minWidth: '30px',
  padding: '0.5rem 0',
  border: 'none',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  fontWeight: '700',
  transition: 'all 0.2s ease',
  fontSize: '0.9rem'
};

const textareaStyle = {
  padding: '0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid #d9ded8',
  fontFamily: 'inherit',
  resize: 'vertical',
  outline: 'none',
  backgroundColor: '#f7f7f2',
  color: '#1f2933'
};

const btnEnviarStyle = {
  backgroundColor: '#176b4d',
  color: '#ffffff',
  border: 'none',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '1rem',
  marginTop: '0.5rem'
};

export default Avaliacao;