export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validarCadastro({ nome, email, senha }) {
  if (!nome || nome.trim().length < 3) return 'Informe um nome com pelo menos 3 letras.'
  if (!validarEmail(email)) return 'Informe um e-mail válido.'
  if (!senha || senha.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.'
  return ''
}
