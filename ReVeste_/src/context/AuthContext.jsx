import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'reveste_usuario_logado'
const USERS_KEY = 'reveste_usuarios'

const usuarioDemo = {
  id: 'ana-demo',
  nome: 'Ana Ingridy',
  email: 'ana@email.com',
  senha: '123456',
  telefone: '(88) 99999-0000',
  endereco: 'Milagres - CE',
  avatar: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=80',
  vats: 120,
  reputacao: 9.6,
  negociacoes: 8,
  desde: '2026'
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function garantirUsuarioDemo() {
  const usuarios = readJSON(USERS_KEY, [])
  const existe = usuarios.some((usuario) => usuario.email === usuarioDemo.email)

  if (!existe) {
    saveJSON(USERS_KEY, [usuarioDemo, ...usuarios])
  }
}

export function AuthProvider({ children }) {
  garantirUsuarioDemo()

  const [usuario, setUsuario] = useState(() => readJSON(STORAGE_KEY, null))

  function login(email, senha) {
    const usuarios = readJSON(USERS_KEY, [])
    const encontrado = usuarios.find(
      (item) => item.email.trim().toLowerCase() === email.trim().toLowerCase() && item.senha === senha
    )

    if (!encontrado) {
      return { ok: false, mensagem: 'E-mail ou senha inválidos. Use ana@email.com e senha 123456 para testar.' }
    }

    const usuarioSeguro = { ...encontrado }
    delete usuarioSeguro.senha
    saveJSON(STORAGE_KEY, usuarioSeguro)
    setUsuario(usuarioSeguro)
    return { ok: true }
  }

  function cadastrar(dados) {
    const usuarios = readJSON(USERS_KEY, [])
    const emailJaExiste = usuarios.some(
      (item) => item.email.trim().toLowerCase() === dados.email.trim().toLowerCase()
    )

    if (emailJaExiste) {
      return { ok: false, mensagem: 'Este e-mail já está cadastrado.' }
    }

    const novoUsuario = {
      id: `user-${Date.now()}`,
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      telefone: dados.telefone || 'Não informado',
      endereco: dados.endereco || 'Não informado',
      avatar: dados.avatar || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80',
      vats: 0,
      reputacao: 0,
      negociacoes: 0,
      desde: new Date().getFullYear().toString()
    }

    saveJSON(USERS_KEY, [novoUsuario, ...usuarios])
    const usuarioSeguro = { ...novoUsuario }
    delete usuarioSeguro.senha
    saveJSON(STORAGE_KEY, usuarioSeguro)
    setUsuario(usuarioSeguro)
    return { ok: true }
  }

  function atualizarPerfil(dados) {
    if (!usuario) return

    const atualizado = { ...usuario, ...dados }
    const usuarios = readJSON(USERS_KEY, [])
    const atualizados = usuarios.map((item) => {
      if (item.id !== usuario.id) return item
      return { ...item, ...dados }
    })

    saveJSON(USERS_KEY, atualizados)
    saveJSON(STORAGE_KEY, atualizado)
    setUsuario(atualizado)
  }

  function comprarVATs(valor) {
    const qtd = Number(valor)
    if (!usuario || Number.isNaN(qtd) || qtd <= 0) return
    atualizarPerfil({ vats: Number(usuario.vats || 0) + qtd })
  }

  function trocarVATs(valor) {
    const qtd = Number(valor)
    if (!usuario || Number.isNaN(qtd) || qtd <= 0) return
    atualizarPerfil({ vats: Math.max(0, Number(usuario.vats || 0) - qtd) })
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUsuario(null)
  }

  const value = { usuario, login, cadastrar, atualizarPerfil, comprarVATs, trocarVATs, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa estar dentro de AuthProvider')
  }
  return context
}
