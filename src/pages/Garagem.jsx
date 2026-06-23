import React, { useEffect } from 'react';
import { useGaragem } from '../hooks/useGaragem'; // Importando o hook da garagem de volta

const Garagem = () => {
  // Restaurando o mockup original para a tela voltar a funcionar
  const usuarioIdTeste = 'usuario_123';
  
  // Trazendo as funções da garagem de volta à vida
  const { garagem, moverItem } = useGaragem(usuarioIdTeste);

  // O seu useEffect para simular os itens
  useEffect(() => {
    const dados = localStorage.getItem(`reveste_garagem_${usuarioIdTeste}`);
    const garagemAtual = dados ? JSON.parse(dados) : null;
    
    if (garagemAtual && garagemAtual.disponivel.length === 0 && garagemAtual.negociacao.length === 0 && garagemAtual.concluido.length === 0) {
      const mockItem = { id: 'item_teste_1', titulo: 'Jaqueta Jeans Vintage' };
      garagemAtual.disponivel.push(mockItem);
      localStorage.setItem(`reveste_garagem_${usuarioIdTeste}`, JSON.stringify(garagemAtual));
      window.location.reload(); 
    }
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#16382c', marginBottom: '2rem', textAlign: 'center', fontWeight: '800' }}>Minha Garagem Virtual</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Lista: Disponível */}
        <div style={colunaStyle}>
          <h2 style={tituloListaStyle}>Disponível</h2>
          {garagem.disponivel.length === 0 ? <p style={textoVazioStyle}>Nenhum item disponível.</p> : (
            garagem.disponivel.map(item => (
              <div key={item.id} style={cardStyle}>
                <p style={itemTituloStyle}>{item.titulo}</p>
                <button onClick={() => moverItem(item.id, 'disponivel', 'negociacao')} style={btnVerde}>
                  Ir para Negociação
                </button>
              </div>
            ))
          )}
        </div>

        {/* Lista: Em Negociação */}
        <div style={colunaStyle}>
          <h2 style={tituloListaStyle}>Em Negociação</h2>
          {garagem.negociacao.length === 0 ? <p style={textoVazioStyle}>Nenhuma negociação rolando.</p> : (
            garagem.negociacao.map(item => (
              <div key={item.id} style={cardStyle}>
                <p style={itemTituloStyle}>{item.titulo}</p>
                <button onClick={() => moverItem(item.id, 'negociacao', 'concluido')} style={btnVerde}>
                  Marcar como Vendido/Trocado
                </button>
                <button onClick={() => moverItem(item.id, 'negociacao', 'disponivel')} style={btnCinza}>
                  Cancelar Negociação
                </button>
              </div>
            ))
          )}
        </div>

        {/* Lista: Concluído */}
        <div style={colunaStyle}>
          <h2 style={tituloListaStyle}>Trocado/Vendido</h2>
          {garagem.concluido.length === 0 ? <p style={textoVazioStyle}>Histórico vazio.</p> : (
            garagem.concluido.map(item => (
              <div key={item.id} style={{ ...cardStyle, opacity: 0.7, border: 'none', backgroundColor: '#d9ded8' }}>
                <p style={itemTituloStyle}>{item.titulo}</p>
                <span style={{ fontSize: '0.85rem', color: '#16382c', fontWeight: '700' }}>Negociação Concluída</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

// Estilos baseados no index.css
const colunaStyle = {
  flex: '1',
  minWidth: '280px',
  backgroundColor: '#ffffff',
  padding: '1.5rem',
  borderRadius: '0.5rem',
  border: '1px solid #d9ded8',
};

const tituloListaStyle = {
  fontSize: '1.25rem',
  color: '#16382c',
  borderBottom: '2px solid #176b4d',
  paddingBottom: '0.5rem',
  marginBottom: '1.5rem',
  fontWeight: '800'
};

const textoVazioStyle = {
  color: '#1f2933',
  opacity: 0.7
};

const cardStyle = {
  border: '1px solid #d9ded8',
  padding: '1rem',
  borderRadius: '0.5rem',
  marginBottom: '1rem',
  backgroundColor: '#f7f7f2'
};

const itemTituloStyle = {
  color: '#1f2933',
  fontWeight: '700',
  margin: '0 0 0.5rem 0'
};

const btnVerde = {
  backgroundColor: '#176b4d',
  color: '#ffffff',
  border: 'none',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  width: '100%',
  fontWeight: '700',
  marginTop: '0.5rem'
};

const btnCinza = {
  backgroundColor: '#d9ded8',
  color: '#1f2933',
  border: 'none',
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  width: '100%',
  fontWeight: '700',
  marginTop: '0.5rem'
};

export default Garagem;