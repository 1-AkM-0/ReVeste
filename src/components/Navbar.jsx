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
    { to: usuario ? ROUTES.perfil : ROUTES.login, label: usuario ? 'Perfil' : 'Login' },
  ];

  const mobileLinks = usuario ? links : [...links, { to: ROUTES.cadastro, label: 'Cadastro' }];

  function handleLogout() {
    logout();
    setAberto(false);
  }

  return (
    <header className="site-header">
      <Link className="brand" to={ROUTES.home}>
        ReVeste
      </Link>

      <nav className="desktop-nav" aria-label="Navegacao principal">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}

        {!usuario && <NavLink to={ROUTES.cadastro}>Cadastro</NavLink>}
        {usuario && (
          <button className="link-button" type="button" onClick={handleLogout}>
            Sair
          </button>
        )}
        {usuario && (
          <span className="user-pill">
            {usuario.nome}
            <span className="user-vats">
              {usuario.vats ?? 0} VATs
            </span>
          </span>
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
        aria-expanded={aberto}
      >
        Menu
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
