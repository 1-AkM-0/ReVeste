import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../routes'
import { validarCadastro } from '../utils/validations'

function Cadastro() {
  const navigate = useNavigate()
  const { cadastrar } = useAuth()
  const [dados, setDados] = useState({ nome: '', email: '', senha: '', telefone: '', endereco: '', avatar: '' })
  const [erro, setErro] = useState('')

  function update(field, value) {
    setDados((old) => ({ ...old, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validacao = validarCadastro(dados)
    if (validacao) {
      setErro(validacao)
      return
    }

    const resultado = cadastrar(dados)
    if (!resultado.ok) {
      setErro(resultado.mensagem)
      return
    }

    navigate(ROUTES.perfil)
  }

  return (
    <AuthForm title="Crie sua conta" subtitle="Monte seu perfil de moda circular e comece com seus itens no ReVeste.">
      <form className="form-stack two-columns" onSubmit={handleSubmit}>
        <label>Nome<input value={dados.nome} onChange={(e) => update('nome', e.target.value)} placeholder="Ana Ingridy" /></label>
        <label>E-mail<input type="email" value={dados.email} onChange={(e) => update('email', e.target.value)} placeholder="seu@email.com" /></label>
        <label>Senha<input type="password" value={dados.senha} onChange={(e) => update('senha', e.target.value)} placeholder="mínimo 6 caracteres" /></label>
        <label>Telefone<input value={dados.telefone} onChange={(e) => update('telefone', e.target.value)} placeholder="(88) 99999-0000" /></label>
        <label className="full-field">Endereço<input value={dados.endereco} onChange={(e) => update('endereco', e.target.value)} placeholder="Cidade - UF" /></label>
        <label className="full-field">Avatar URL<input value={dados.avatar} onChange={(e) => update('avatar', e.target.value)} placeholder="https://..." /></label>

        {erro && <p className="form-error full-field">{erro}</p>}
        <button className="full-field" type="submit">Cadastrar e entrar</button>
      </form>
    </AuthForm>
  )
}

export default Cadastro
