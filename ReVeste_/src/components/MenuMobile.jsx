import { Link } from 'react-router-dom'

function MenuMobile({ aberto, links, onClick }) {
  if (!aberto) return null

  return (
    <div className="mobile-menu">
      {links.map((link) => (
        <Link key={link.to} to={link.to} onClick={onClick}>{link.label}</Link>
      ))}
    </div>
  )
}

export default MenuMobile
