import { Link } from 'react-router-dom';

import { ROUTES } from '../routes';

function Home() {
  return (
    <>
      <section className="hero home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Consumo consciente, estilo autentico</p>
          <h1>
            Pecas incriveis merecem <i>novas historias.</i>
          </h1>
          <p>
            Descubra achados unicos, negocie do seu jeito e faca a moda circular.
          </p>

          <div className="home-actions">
            <Link className="primary-link" to={ROUTES.explorar}>
              Explorar pecas
            </Link>
            <Link className="secondary-link" to={ROUTES.criarAnuncio}>
              Anunciar uma peca
            </Link>
          </div>

          <div className="home-stats" aria-label="Resumo da comunidade">
            <span>
              <strong>10+</strong>
              pecas circulando
            </span>
            <span>
              <strong>5+</strong>
              pessoas na comunidade
            </span>
            <span>
              <strong>VATs</strong>
              trocas mais justas
            </span>
          </div>
        </div>

        <div className="home-hero-image" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=85"
            alt=""
          />
          <div className="home-float-card">
            <strong>Troque sem medo</strong>
            <small>VATs deixam tudo mais justo</small>
          </div>
        </div>
      </section>

      <section className="home-how">
        <p className="eyebrow">Simples e direto</p>
        <h2>Como funciona?</h2>
        <div>
          <article>
            <strong>01</strong>
            <h3>Desapegue</h3>
            <p>Publique pecas, servicos ou alugueis em poucos passos.</p>
          </article>
          <article>
            <strong>02</strong>
            <h3>Negocie</h3>
            <p>Combine venda, troca ou complemento em VATs.</p>
          </article>
          <article>
            <strong>03</strong>
            <h3>Faca circular</h3>
            <p>Conclua, avalie e acompanhe tudo na sua garagem.</p>
          </article>
        </div>
      </section>
    </>
  );
}

export default Home;
