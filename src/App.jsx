import { Link, Navigate, Route, Routes } from "react-router-dom";

import { NegociacaoProvider } from "./context/NegociacaoContext";

import CriarAnuncio from "./pages/CriarAnuncio";
import DetalheAnuncio from "./pages/DetalheAnuncio";
import EditarAnuncio from "./pages/EditarAnuncio";
import Explorar from "./pages/Explorar";
import Home from "./pages/Home";
import "./styles/styles.css"

import { ROUTES } from "./routes";

function App() {
  return (
    <NegociacaoProvider>
      <div className="app-shell">
        <header className="site-header">
          <Link className="brand" to={ROUTES.home}>
            ReVeste
          </Link>

          <nav aria-label="Navegação principal">
            <Link to={ROUTES.home}>Início</Link>
            <Link to={ROUTES.explorar}>Explorar</Link>
            <Link to={ROUTES.criarAnuncio}>Novo anúncio</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={ROUTES.explorar} element={<Explorar />} />
            <Route path={ROUTES.criarAnuncio} element={<CriarAnuncio />} />
            <Route path={ROUTES.anuncioDetalhe} element={<DetalheAnuncio />} />
            <Route path={ROUTES.editarAnuncio} element={<EditarAnuncio />} />

            <Route path="*" element={<Navigate replace to={ROUTES.home} />} />
          </Routes>
        </main>
      </div>
    </NegociacaoProvider>
  );
}

export default App;
