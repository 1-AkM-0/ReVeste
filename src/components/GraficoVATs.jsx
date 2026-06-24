import { generateId } from '../utils/ids';

const CHAVE_MOV = 'reveste_vats_mov';

export function registrarMovVATs(usuarioId, amount) {
  if (!usuarioId || !Number.isFinite(amount) || amount === 0) return;
  const chave = `${CHAVE_MOV}_${usuarioId}`;
  const historico = JSON.parse(localStorage.getItem(chave) || '[]');
  historico.push({
    id: generateId('vm'),
    amount,
    at: new Date().toISOString(),
  });
  if (historico.length > 60) historico.splice(0, historico.length - 60);
  localStorage.setItem(chave, JSON.stringify(historico));
}

export function obterMovVATs(usuarioId) {
  if (!usuarioId) return [];
  const chave = `${CHAVE_MOV}_${usuarioId}`;
  return JSON.parse(localStorage.getItem(chave) || '[]');
}
