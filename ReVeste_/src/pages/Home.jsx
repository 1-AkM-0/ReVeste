import { Link } from 'react-router-dom'
import { ROUTES } from '../routes'

function Home() {
  return (
    <section className="home-hero">
      <div className="hero-content">
        <p className="eyebrow">Moda circular</p>
        <h1>Renove seu estilo sem desperdiçar recursos.</h1>
        <p>Encontre, venda, troque e dê uma nova história às peças do seu guarda-roupa com uma experiência bonita, simples e sustentável.</p>
        <div className="hero-actions">
          <Link className="primary-button" to={ROUTES.explorar}>Explorar peças</Link>
          <Link className="secondary-button" to={ROUTES.login}>Entrar como Ana</Link>
        </div>
      </div>
      <div className="hero-gallery" aria-label="Roupas disponíveis">
        <img src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80" alt="Arara de roupas" />
        <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80" alt="Look sustentável" />
      </div>
    </section>
  )
}

export default Home
