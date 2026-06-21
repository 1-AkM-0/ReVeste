import { generateId } from './ids';

test('gera IDs com prefixo, timestamp e trecho aleatório', () => {
  jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
  jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

  expect(generateId('anuncio')).toMatch(/^anuncio_[a-z0-9]+_[a-z0-9]{8}$/);

  jest.restoreAllMocks();
});
