function AuthForm({ children, title, subtitle, eyebrow }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">{eyebrow || 'ReVeste - Moda Circular'}</p>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </div>

      <aside className="auth-visual" aria-label="Moda circular e roupas sustentaveis">
        <div className="floating-card top-card">+120 VATs para testar</div>
        <div className="floating-card bottom-card">Troque, venda e renove</div>
      </aside>
    </section>
  );
}

export default AuthForm;
