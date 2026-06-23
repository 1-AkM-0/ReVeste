import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../routes'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('ana@email.com')
  const [senha, setSenha] = useState('123456')
  const [erro, setErro] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const resultado = login(email, senha)

    if (!resultado.ok) {
      setErro(resultado.mensagem)
      return
    }

    navigate(ROUTES.perfil)
  }

  return (
    <AuthForm title="Entre na sua conta" subtitle="Acesse seu perfil, acompanhe seu saldo VATs e continue suas negociações.">
      <div className="demo-login">
        <strong>Login pronto para testar:</strong>
        <span>ana@email.com</span>
        <span>Senha: 123456</span>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ana@email.com" />
        </label>

        <label>
          Senha
          <input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="123456" />
        </label>

        {erro && <p className="form-error">{erro}</p>}

        <button type="submit">Entrar agora</button>
      </form>

      <p className="auth-footer">Ainda não tem conta? <Link to={ROUTES.cadastro}>Criar cadastro</Link></p>
    </AuthForm>
  )
}

export default Login
