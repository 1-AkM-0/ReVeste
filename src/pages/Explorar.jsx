import { useNegociacao } from '../context/NegociacaoContext'

import AcoesNegociacao from '../components/AcoesNegociacao'
import EnviarProposta from '../components/EnviarProposta'
import SugestaoVATs from '../components/SugestaoVATs'
import TimelineProposta from '../components/TimelineProposta'

function Explorar() {
  const { propostas } = useNegociacao()

  const anuncio = {
    id: 1,
    usuarioId: 1,
    titulo: 'Jaqueta Jeans',
    descricao: 'Jaqueta jeans azul em ótimo estado.',
    valor: 35
  }

  const usuario = {
    id: 2,
    nome: 'Jônatas'
  }

  return (
    <section>
      <p className="eyebrow">
        Descubra
      </p>

      <h1>
        Explorar peças
      </h1>

      <article
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem'
        }}
      >
        <h2>
          {anuncio.titulo}
        </h2>

        <p>
          {anuncio.descricao}
        </p>

        <p>
          <strong>
            Valor:
          </strong>{' '}
          {anuncio.valor} VATs
        </p>

        <SugestaoVATs
          valorAnuncio={anuncio.valor}
          valorOferta={30}
        />

        <EnviarProposta
          anuncio={anuncio}
          usuario={usuario}
        />
      </article>

      {propostas.map((proposta) => (
        <article
          key={proposta.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}
        >
          <h3>
            Proposta #{proposta.id}
          </h3>

          <p>
            Status: {proposta.status}
          </p>

          <p>
            Valor ofertado: {proposta.valorOfertado} VATs
          </p>

          <AcoesNegociacao
            id={proposta.id}

            status={proposta.status}
          />

          <TimelineProposta
            historico={proposta.historico}
          />
        </article>
      ))}
    </section>
  )
}

export default Explorar