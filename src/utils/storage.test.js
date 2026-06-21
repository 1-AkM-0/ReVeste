import { getStorage, removeStorage, setStorage } from './storage';

beforeEach(() => {
  window.localStorage.clear();
});

test('salva e recupera valores serializados', () => {
  const value = { tema: 'escuro', categorias: ['camisas'] };

  expect(setStorage('preferencias', value)).toBe(true);
  expect(getStorage('preferencias')).toEqual(value);
});

test('usa o fallback quando a chave não existe ou contém JSON inválido', () => {
  window.localStorage.setItem('invalido', '{');

  expect(getStorage('ausente', [])).toEqual([]);
  expect(getStorage('invalido', 'fallback')).toBe('fallback');
});

test('remove uma chave existente', () => {
  setStorage('sessao', { id: 1 });

  expect(removeStorage('sessao')).toBe(true);
  expect(getStorage('sessao')).toBeNull();
});
