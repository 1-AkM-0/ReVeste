import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ROUTES } from '../routes'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import MenuMobile from './MenuMobile'

function Navbar() {
  const [aberto, setAberto] = useState(false)
  const { usuario, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const links = [
    { to: ROUTES.home, label: 'Início' },
    { to: ROUTES.explorar, label: 'Explorar' },
    { to: ROUTES.garagem, label: 'Garagem' },
    { to: ROUTES.login, label: usuario ? 'Perfil' : 'Login' }
  ]

  return (
    <header className="site-header">
      <Link className="brand" to={ROUTES.home}>ReVeste</Link>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
        ))}
        {!usuario && <NavLink to={ROUTES.cadastro}>Cadastro</NavLink>}
        {usuario && <span className="user-pill">{usuario.nome}</span>}
        {usuario && <button className="link-button" onClick={logout}>Sair</button>}
        <button className="theme-toggle" type="button" onClick={toggleTheme}>{isDark ? '☀️ Claro' : '🌙 Escuro'}</button>
      </nav>

      <button className="hamburger" type="button" onClick={() => setAberto((old) => !old)} aria-label="Abrir menu">☰</button>
      <MenuMobile aberto={aberto} links={usuario ? links : [...links, { to: ROUTES.cadastro, label: 'Cadastro' }]} onClick={() => setAberto(false)} />
    </header>
  )
}

export default Navbar
