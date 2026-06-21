import { Link } from 'react-router-dom';

import { ROUTES } from '../routes';

function Home() {
  return (
    <section className="hero">
      <p className="eyebrow">Moda circular</p>
      <h1>Renove seu estilo sem desperdiçar recursos.</h1>
      <p>Encontre, troque e dê uma nova história às peças do seu guarda-roupa.</p>
      <Link className="primary-link" to={ROUTES.explorar}>
        Explorar peças
      </Link>
    </section>
  );
}

export default Home;
