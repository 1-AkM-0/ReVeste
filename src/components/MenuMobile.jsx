import { Link } from 'react-router-dom';

function MenuMobile({ aberto, links, onClick, usuario, logout, toggleTheme, isDark }) {
  if (!aberto) return null;

  return (
    <div className="mobile-menu">
      {links.map((link) => (
        <Link key={link.to} to={link.to} onClick={onClick}>
          {link.label}
        </Link>
      ))}

      {usuario && (
        <button type="button" onClick={logout}>
          Sair
        </button>
      )}

      <button type="button" onClick={toggleTheme}>
        {isDark ? 'Tema claro' : 'Tema escuro'}
      </button>
    </div>
  );
}

export default MenuMobile;
