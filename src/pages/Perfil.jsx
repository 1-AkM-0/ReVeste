import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import ReputacaoBadge from '../components/ReputacaoBadge';
import SaldoVATs from '../components/SaldoVATs';
import SelosConfiabilidade from '../components/SelosConfiabilidade';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';
import { calcularReputacao } from '../utils/avaliacoes';

function Perfil() {
  const { usuario, comprarVATs, trocarVATs } = useAuth();

  const reputacao = useMemo(
    () => calcularReputacao(usuario?.id),
    [usuario?.id]
  );

  if (!usuario) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <section className="perfil-page">
      <div className="profile-hero">
        <img src={usuario.avatar} alt={`Avatar de ${usuario.nome}`} />
        <div>
          <p className="eyebrow">Meu Perfil</p>
          <h1>{usuario.nome}</h1>
          <p>
            {usuario.email} - {usuario.telefone}
          </p>
          <p>{usuario.endereco}</p>
        </div>
      </div>

      <div className="profile-grid">
        <SaldoVATs saldo={usuario.vats} onComprar={comprarVATs} onTrocar={trocarVATs} />

        <article className="profile-card">
          <h2>Reputacao</h2>
          <ReputacaoBadge nota={reputacao.media || usuario.reputacao || 0} totalNegociacoes={reputacao.total || usuario.negociacoes || 0} />
          <p>Perfil ativo desde {usuario.desde}. Usuarios com boa avaliacao ganham mais confianca nas trocas.</p>
          <SelosConfiabilidade
            usuarioId={usuario.id}
            desde={usuario.desde}
            negociacoes={reputacao.total || usuario.negociacoes}
          />
        </article>

        <article className="profile-card wide-card">
          <h2>Resumo</h2>
          <div className="stats-row">
            <span>
              <strong>{reputacao.total || usuario.negociacoes || 0}</strong> negociacoes
            </span>
            <span>
              <strong>{usuario.vats || 0}</strong> VATs
            </span>
            <span>
              <strong>{usuario.desde}</strong> desde
            </span>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Perfil;
