import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../routes';
import MenuMobile from './MenuMobile';

function Navbar() {
  const [aberto, setAberto] = useState(false);
  const { usuario, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

const links = [
  { to: ROUTES.home, label: 'Inicio' },
  { to: ROUTES.explorar, label: 'Explorar' },
  ...(usuario ? [{ to: ROUTES.garagem, label: 'Garagem' }] : []),
  ...(usuario ? [{ to: ROUTES.negociacoes, label: 'Negociações' }] : []),
  ...(!usuario ? [{ to: ROUTES.login, label: 'Login' }] : []),
];

  const mobileLinks = usuario ? links : [...links, { to: ROUTES.cadastro, label: 'Cadastro' }];

  function handleLogout() {
    logout();
    setAberto(false);
  }

  return (
    <header className="site-header">
      <Link
        className="brand"
        to={ROUTES.home}
        onClick={() => setAberto(false)}
      >
        ReVeste
      </Link>

      <nav
        className="desktop-nav"
        aria-label="Navegacao principal"
        style={{ display: 'none' }}
      >
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}

        {!usuario && <NavLink to={ROUTES.cadastro}>Cadastro</NavLink>}
        {usuario && (
          <div className="user-menu">
            <button className="user-pill" type="button">
              {usuario.nome}
              <span className="user-vats">
                {usuario.vats ?? 0} VATs
              </span>
            </button>

            <div className="user-dropdown">
              <NavLink to={ROUTES.perfil}>
                Meu Perfil
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="dropdown-logout"
              >
                Sair
              </button>
            </div>
          </div>
        )}
        <button className="theme-toggle" type="button" onClick={toggleTheme}>
          {isDark ? 'Claro' : 'Escuro'}
        </button>
      </nav>
      <button
        className="hamburger"
        type="button"
        onClick={() => setAberto((old) => !old)}
        aria-label="Abrir menu"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <MenuMobile
        aberto={aberto}
        links={mobileLinks}
        onClick={() => setAberto(false)}
        usuario={usuario}
        logout={handleLogout}
        toggleTheme={toggleTheme}
        isDark={isDark}
      />
    </header>
  );
}

export default Navbar;
