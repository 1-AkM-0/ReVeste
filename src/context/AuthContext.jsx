import { createContext, useContext, useState } from 'react';
import { generateId } from '../utils/ids';
import { getStorage, setStorage } from '../utils/storage';

const AuthContext = createContext(null);

const STORAGE_KEY = 'reveste_usuario_logado';
const USERS_KEY = 'reveste_usuarios';

const usuarioDemo = {
  id: 'user-123',
  nome: 'Ana Ingridy',
  email: 'ana@email.com',
  senha: '123456',
  telefone: '(88) 99999-0000',
  endereco: 'Milagres - CE',
  avatar: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=80',
  vats: 120,
  reputacao: 9.6,
  negociacoes: 8,
  desde: '2026',
};

function withoutPassword(usuario) {
  if (!usuario) return null;

  const seguro = { ...usuario };
  delete seguro.senha;
  return seguro;
}

function readUsuarios() {
  const usuarios = getStorage(USERS_KEY, []);
  return Array.isArray(usuarios) ? usuarios : [];
}

function saveUsuarios(usuarios) {
  setStorage(USERS_KEY, usuarios);
}

function garantirUsuarioDemo() {
  const usuarios = readUsuarios();
  const existe = usuarios.some((usuario) => usuario.email === usuarioDemo.email);

  if (!existe) {
    saveUsuarios([usuarioDemo, ...usuarios]);
  }
}

export function AuthProvider({ children }) {
  garantirUsuarioDemo();

  const [usuario, setUsuario] = useState(() => getStorage(STORAGE_KEY, null));

  function login(email, senha) {
    const encontrado = readUsuarios().find(
      (item) =>
        item.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        item.senha === senha
    );

    if (!encontrado) {
      return {
        ok: false,
        mensagem: 'E-mail ou senha invalidos. Use ana@email.com e senha 123456 para testar.',
      };
    }

    const usuarioSeguro = withoutPassword(encontrado);
    setStorage(STORAGE_KEY, usuarioSeguro);
    setUsuario(usuarioSeguro);
    return { ok: true };
  }

  function cadastrar(dados) {
    const usuarios = readUsuarios();
    const emailJaExiste = usuarios.some(
      (item) => item.email.trim().toLowerCase() === dados.email.trim().toLowerCase()
    );

    if (emailJaExiste) {
      return { ok: false, mensagem: 'Este e-mail ja esta cadastrado.' };
    }

    const novoUsuario = {
      id: generateId('user'),
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      senha: dados.senha,
      telefone: dados.telefone?.trim() || 'Nao informado',
      endereco: dados.endereco?.trim() || 'Nao informado',
      avatar:
        dados.avatar?.trim() ||
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80',
      vats: 0,
      reputacao: 0,
      negociacoes: 0,
      desde: new Date().getFullYear().toString(),
    };

    saveUsuarios([novoUsuario, ...usuarios]);

    const usuarioSeguro = withoutPassword(novoUsuario);
    setStorage(STORAGE_KEY, usuarioSeguro);
    setUsuario(usuarioSeguro);
    return { ok: true };
  }

  function atualizarPerfil(dados) {
    if (!usuario) return;

    const atualizado = { ...usuario, ...dados };
    const atualizados = readUsuarios().map((item) =>
      item.id === usuario.id ? { ...item, ...dados } : item
    );

    saveUsuarios(atualizados);
    setStorage(STORAGE_KEY, atualizado);
    setUsuario(atualizado);
  }

  function comprarVATs(valor) {
    const qtd = Number(valor);
    if (!usuario || Number.isNaN(qtd) || qtd <= 0) return;
    atualizarPerfil({ vats: Number(usuario.vats || 0) + qtd });
  }

  function trocarVATs(valor) {
    const qtd = Number(valor);
    if (!usuario || Number.isNaN(qtd) || qtd <= 0) return;
    atualizarPerfil({ vats: Math.max(0, Number(usuario.vats || 0) - qtd) });
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  }

  const value = {
    usuario,
    user: usuario,
    login,
    cadastrar,
    atualizarPerfil,
    comprarVATs,
    trocarVATs,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de AuthProvider');
  }

  return context;
}
