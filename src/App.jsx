import { Link, Navigate, Route, Routes } from 'react-router-dom';

import Explorar from './pages/Explorar';
import Home from './pages/Home';
import { ROUTES } from './routes';

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to={ROUTES.home}>
          ReVeste
        </Link>
        <nav aria-label="Navegação principal">
          <Link to={ROUTES.home}>Início</Link>
          <Link to={ROUTES.explorar}>Explorar</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path={ROUTES.home} element={<Home />} />
          <Route path={ROUTES.explorar} element={<Explorar />} />
          <Route path="*" element={<Navigate replace to={ROUTES.home} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
