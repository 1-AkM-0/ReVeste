import { useMemo, useState } from 'react'
import { useNegociacao } from '../context/NegociacaoContext'
import { anunciosMock } from '../data'
import AcoesNegociacao from '../components/AcoesNegociacao'
import EnviarProposta from '../components/EnviarProposta'
import SugestaoVATs from '../components/SugestaoVATs'
import TimelineProposta from '../components/TimelineProposta'

const categorias = ['Todas', 'Jaqueta', 'Vestido', 'Calçado', 'Acessório', 'Camisa', 'Calça']
const modalidades = ['Todas', 'Venda', 'Troca', 'Ambos']

function Explorar() {
  const { propostas } = useNegociacao()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [modalidade, setModalidade] = useState('Todas')
  const [maxVATs, setMaxVATs] = useState(60)

  const usuario = { id: 2, nome: 'Ana Ingridy' }

  const anunciosFiltrados = useMemo(() => {
    return anunciosMock.filter((anuncio) => {
      const texto = `${anuncio.titulo} ${anuncio.descricao}`.toLowerCase()
      const bateBusca = texto.includes(busca.toLowerCase())
      const bateCategoria = categoria === 'Todas' || anuncio.categoria === categoria
      const bateModalidade = modalidade === 'Todas' || anuncio.modalidade === modalidade
      const bateValor = anuncio.valor <= Number(maxVATs)
      return bateBusca && bateCategoria && bateModalidade && bateValor
    })
  }, [busca, categoria, modalidade, maxVATs])

  return (
    <section className="explorar-page">
      <div className="page-heading">
        <p className="eyebrow">Garimpo inteligente</p>
        <h1>Explorar peças</h1>
        <p>Escolha por tipo de peça, modalidade e valor em VATs. As imagens deixam a vitrine mais realista para apresentação.</p>
      </div>

      <div className="filters-panel">
        <label>Buscar peça<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="jaqueta, vestido, tênis..." /></label>
        <label>Tipo de peça<select value={categoria} onChange={(e) => setCategoria(e.target.value)}>{categorias.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Modalidade<select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>{modalidades.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Até {maxVATs} VATs<input type="range" min="10" max="60" value={maxVATs} onChange={(e) => setMaxVATs(e.target.value)} /></label>
      </div>

      <div className="cards-grid">
        {anunciosFiltrados.map((anuncio) => (
          <article className="item-card" key={anuncio.id}>
            <img src={anuncio.imagem} alt={anuncio.titulo} />
            <div className="item-card-body">
              <div className="tag-row"><span>{anuncio.categoria}</span><span>{anuncio.modalidade}</span></div>
              <h2>{anuncio.titulo}</h2>
              <p>{anuncio.descricao}</p>
              <div className="item-meta"><strong>{anuncio.valor} VATs</strong><span>{anuncio.tamanho} • {anuncio.estado}</span></div>
              <SugestaoVATs valorAnuncio={anuncio.valor} valorOferta={Math.max(1, anuncio.valor - 5)} />
              <EnviarProposta anuncio={anuncio} usuario={usuario} />
            </div>
          </article>
        ))}
      </div>

      {anunciosFiltrados.length === 0 && <p className="empty-state">Nenhuma peça encontrada com esses filtros.</p>}

      {propostas.length > 0 && <h2 className="section-title">Propostas criadas nesta sessão</h2>}
      {propostas.map((proposta) => (
        <article key={proposta.id} className="proposal-card">
          <h3>Proposta #{proposta.id}</h3>
          <p>Status: {proposta.status}</p>
          <p>Valor ofertado: {proposta.valorOfertado} VATs</p>
          <AcoesNegociacao id={proposta.id} status={proposta.status} />
          <TimelineProposta historico={proposta.historico} />
        </article>
      ))}
    </section>
  )
}

export default Explorar
