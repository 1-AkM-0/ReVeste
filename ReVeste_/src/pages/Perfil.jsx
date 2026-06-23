import { Navigate } from 'react-router-dom'
import SaldoVATs from '../components/SaldoVATs'
import ReputacaoBadge from '../components/ReputacaoBadge'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../routes'

function Perfil() {
  const { usuario, comprarVATs, trocarVATs } = useAuth()

  if (!usuario) {
    return <Navigate to={ROUTES.login} replace />
  }

  return (
    <section className="perfil-page">
      <div className="profile-hero">
        <img src={usuario.avatar} alt={`Avatar de ${usuario.nome}`} />
        <div>
          <p className="eyebrow">Meu Perfil</p>
          <h1>{usuario.nome}</h1>
          <p>{usuario.email} • {usuario.telefone}</p>
          <p>{usuario.endereco}</p>
        </div>
      </div>

      <div className="profile-grid">
        <SaldoVATs saldo={usuario.vats} onComprar={comprarVATs} onTrocar={trocarVATs} />

        <article className="profile-card">
          <h2>Reputação</h2>
          <ReputacaoBadge nota={usuario.reputacao || 0} totalNegociacoes={usuario.negociacoes || 0} />
          <p>Perfil ativo desde {usuario.desde}. Usuários com boa avaliação ganham mais confiança nas trocas.</p>
        </article>

        <article className="profile-card wide-card">
          <h2>Resumo da Ana Ingridy</h2>
          <div className="stats-row">
            <span><strong>8</strong> negociações</span>
            <span><strong>5</strong> peças anunciadas</span>
            <span><strong>120</strong> VATs iniciais</span>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Perfil
