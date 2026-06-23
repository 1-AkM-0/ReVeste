# 🗓️ Plano de Commits — Entrega Terça-Feira
**Equipe 03 · ReVeste — Moda Circular · Do zero em 48h**

> ⚠️ **ATENÇÃO:** Hoje é domingo. A entrega é terça. Vocês têm ~48 horas.
> Este plano prioriza o que vale nota: funcionalidades obrigatórias, persistência, responsividade e README.
> Cada membro faz commits no próprio branch e abre PR para a `main` ao final de cada bloco. **Só o Pedro Yan mergeia na main.**

---

## 👥 Divisão de Responsabilidades

| Membro | Branch | O que entrega |
|---|---|---|
| **Pedro Yan** | `setup/pedro` | Estrutura, rotas, localStorage helpers, README, merge final |
| **Ana Ingridy** | `auth/ana` | Login, Cadastro, Perfil, saldo VATs, responsividade + dark mode |
| **Danillo** | `anuncios/danillo` | CRUD anúncios, página Explorar, filtros, busca, detalhe |
| **Jonatas** | `propostas/jonatas` | Sistema de propostas, contrapropostas, lógica VATs, histórico |
| **Jhonatan** | `chat/jhonatan` | Chat temporário, Garagem Virtual, avaliações pós-negociação |

---

## ☀️ DOMINGO — Setup & Base
> Meta: repositório funcional até à meia-noite

| # | Horário | Quem | Branch | Mensagem do Commit | Arquivos / Componentes |
|---|---|---|---|---|---|
| 1 | 09:00 | Pedro Yan | `setup/pedro` | `chore: init project com CRA + estrutura de pastas` | `src/components/`, `src/pages/`, `src/utils/storage.js`, `src/context/` |
| 2 | 09:30 | Pedro Yan | `setup/pedro` | `feat: configurar React Router + rotas base` | `App.jsx`, `src/routes.js`, `pages/Home.jsx`, `pages/Explorar.jsx` |
| 3 | 10:00 | Pedro Yan | `setup/pedro` | `feat: helper localStorage (get/set/remove genérico)` | `src/utils/storage.js`, `src/utils/ids.js` |
| 4 | 10:00 | Ana Ingridy | `auth/ana` | `feat: tela de Login com form controlado` | `pages/Login.jsx`, `components/AuthForm.jsx` |
| 5 | 11:00 | Ana Ingridy | `auth/ana` | `feat: tela de Cadastro + validação básica` | `pages/Cadastro.jsx`, `utils/validations.js` |
| 6 | 12:00 | Ana Ingridy | `auth/ana` | `feat: AuthContext — login, logout, usuário no localStorage` | `context/AuthContext.jsx`, `hooks/useAuth.js` |
| 7 | 10:30 | Danillo | `anuncios/danillo` | `feat: formulário de criar anúncio (todos os campos)` | `pages/CriarAnuncio.jsx`, `components/AnuncioForm.jsx` |
| 8 | 12:30 | Danillo | `anuncios/danillo` | `feat: listagem pública de anúncios (página Explorar)` | `pages/Explorar.jsx`, `components/AnuncioCard.jsx` |
| 9 | 10:30 | Jonatas | `propostas/jonatas` | `feat: estrutura de dados — schema proposta/negociação` | `utils/schemas.js`, `context/NegociacaoContext.jsx` |
| 10 | 12:00 | Jonatas | `propostas/jonatas` | `feat: lógica VATs — verificação equivalência ±20%` | `utils/vats.js` (`calcDiferenca`, `sugerirComplemento`) |
| 11 | 10:30 | Jhonatan | `chat/jhonatan` | `feat: estrutura Garagem Virtual (3 listas no localStorage)` | `pages/Garagem.jsx`, `hooks/useGaragem.js` |
| 12 | 12:00 | Jhonatan | `chat/jhonatan` | `feat: componente de Chat simples (mensagens + hora)` | `components/Chat.jsx`, `hooks/useChat.js` |
| 13 | 14:00 | Pedro Yan | `setup/pedro` | `chore: merge branches do domingo → main + fix conflitos` | merge PR: auth, anuncios base, garagem base |
| 14 | 14:30 | Ana Ingridy | `auth/ana` | `feat: página de Perfil — dados do usuário + saldo VATs` | `pages/Perfil.jsx`, `components/SaldoVATs.jsx` |
| 15 | 15:00 | Danillo | `anuncios/danillo` | `feat: página de detalhe do anúncio` | `pages/DetalheAnuncio.jsx`, `components/AnuncioDetalhe.jsx` |
| 16 | 15:30 | Danillo | `anuncios/danillo` | `feat: editar e excluir anúncio próprio` | `pages/EditarAnuncio.jsx`, `utils/anuncios.js` |
| 17 | 15:00 | Jonatas | `propostas/jonatas` | `feat: enviar proposta de venda (valor ofertado)` | `components/EnviarProposta.jsx`, `utils/propostas.js` |
| 18 | 16:30 | Jonatas | `propostas/jonatas` | `feat: enviar proposta de troca (peças + VATs opcional)` | `components/PropostaTroca.jsx` |
| 19 | 15:30 | Jhonatan | `chat/jhonatan` | `feat: mover itens entre listas na Garagem` | `components/GaragemLista.jsx`, `utils/garagem.js` |
| 20 | 17:00 | Jhonatan | `chat/jhonatan` | `feat: avaliação pós-negociação (estrelas + comentário)` | `components/Avaliacao.jsx`, `hooks/useAvaliacao.js` |
| 21 | 18:00 | Ana Ingridy | `auth/ana` | `feat: Navbar responsiva + menu mobile (hamburger)` | `components/Navbar.jsx`, `components/MenuMobile.jsx` |
| 22 | 19:00 | Pedro Yan | `setup/pedro` | `chore: merge tarde domingo → main` | merge PR: perfil, detalhe anuncio, propostas v1, garagem v1 |
| 23 | 20:00 | **Todos** | — | 🔍 **Reunião rápida (15 min): alinhamento, o que falta, bugs críticos** | — |

---

## 🌙 SEGUNDA-FEIRA — Integração, Polimento & Entrega
> Meta: tudo rodando até 23h

| # | Horário | Quem | Branch | Mensagem do Commit | Arquivos / Componentes |
|---|---|---|---|---|---|
| 24 | 08:00 | Danillo | `anuncios/danillo` | `feat: filtros por categoria, tamanho, modalidade e VATs` | `components/FiltrosAnuncios.jsx`, `hooks/useFiltros.js` |
| 25 | 09:00 | Danillo | `anuncios/danillo` | `feat: busca por texto no título/descrição` | `components/Busca.jsx`, `utils/search.js` |
| 26 | 08:00 | Jonatas | `propostas/jonatas` | `feat: aceitar / recusar / contrapropor` | `components/AcoesNegociacao.jsx`, `utils/propostas.js` |
| 27 | 09:30 | Jonatas | `propostas/jonatas` | `feat: histórico de propostas em linha do tempo` | `components/TimelineProposta.jsx` |
| 28 | 08:00 | Jhonatan | `chat/jhonatan` | `feat: chat — botão Encerrar + expiração 7 dias` | `utils/chat.js` (`calcExpiracao`), `components/ChatHeader.jsx` |
| 29 | 09:00 | Jhonatan | `chat/jhonatan` | `feat: média de avaliações + total negociações no perfil` | `utils/avaliacoes.js`, `components/ReputacaoBadge.jsx` |
| 30 | 08:00 | Ana Ingridy | `auth/ana` | `feat: dark mode persistente no localStorage` | `context/ThemeContext.jsx`, `styles/dark.css` |
| 31 | 09:30 | Ana Ingridy | `auth/ana` | `fix: responsividade mobile 375px — Explorar e Detalhe` | `pages/Explorar.jsx`, `pages/DetalheAnuncio.jsx` |
| 32 | 10:30 | Pedro Yan | `setup/pedro` | `chore: merge segunda manhã → main` | merge PR: filtros, propostas v2, chat final, dark mode |
| 33 | 11:00 | Pedro Yan | `setup/pedro` | `fix: ajustes de integração (rotas, contextos, IDs)` | `App.jsx`, `context/`, `routes.js` |
| 34 | 11:30 | Ana Ingridy | `auth/ana` | `fix: responsividade — Perfil, Garagem, Navbar (desktop 1024px+)` | `pages/Perfil.jsx`, `pages/Garagem.jsx`, `components/Navbar.jsx` |
| 35 | 12:00 | Danillo | `anuncios/danillo` | `fix: edge cases anúncios — campos obrigatórios, foto URL inválida` | `components/AnuncioForm.jsx`, `utils/validations.js` |
| 36 | 12:30 | Jonatas | `propostas/jonatas` | `fix: lógica VATs — sugestão de complemento na UI` | `components/SugestaoVATs.jsx`, `pages/DetalheAnuncio.jsx` |
| 37 | 13:00 | Jhonatan | `chat/jhonatan` | `fix: Garagem — sincronizar status do anúncio pós-negociação` | `hooks/useGaragem.js`, `utils/anuncios.js` |
| 38 | 14:00 | Pedro Yan | `setup/pedro` | `chore: merge tarde segunda → main + smoke test geral` | merge todos os PRs abertos |
| 39 | 15:00 | **Todos** | — | 🧪 **Teste do fluxo completo (Maria → João: proposta, chat, avaliação)** | — (manual) |
| 40 | 15:30 | Ana Ingridy | `auth/ana` | `fix: bugs de UI encontrados no teste` | ajustes CSS, feedback visual, mensagens de erro |
| 41 | 15:30 | Danillo | `anuncios/danillo` | `fix: bugs de anúncio/filtro encontrados no teste` | `utils/`, `components/` |
| 42 | 16:00 | Jonatas | `propostas/jonatas` | `fix: bugs de proposta/VAT encontrados no teste` | `utils/propostas.js`, `utils/vats.js` |
| 43 | 16:00 | Jhonatan | `chat/jhonatan` | `fix: bugs de chat/garagem encontrados no teste` | `utils/chat.js`, `pages/Garagem.jsx` |
| 44 | 17:00 | Pedro Yan | `setup/pedro` | `chore: merge fixes finais → main` | merge todos os PRs de fix |
| 45 | 18:00 | Pedro Yan | `setup/pedro` | `docs: README completo (nomes, descrição, instalação, screenshots, funcionalidades)` | `README.md` |
| 46 | 19:00 | Pedro Yan | `setup/pedro` | `chore: commit final de entrega — bump versão` | `package.json` version, README badges |
| 47 | 19:30 | **Todos** | — | 🎥 **Gravação do vídeo de apresentação (3–5 min)** | — (OBS/Loom) |
| 48 | 21:00 | Pedro Yan | — | 📧 **Envio por e-mail para samuel.araujo@ifce.edu.br** | link GitHub + `npm start` funcionando |

---

## ⚡ Regras de Ouro para 48h

- 🔀 **Um branch por pessoa.** Nunca commitar direto na `main`. Pedro Yan faz os merges.
- 💬 **Padrão de commit:** `feat:`, `fix:`, `chore:`, `docs:` + descrição curta.
- 🚫 **Se travar mais de 30 min** num problema → chama o grupo no WhatsApp. Não perca tempo solo.
- 💾 **Commitar a cada funcionalidade concluída**, não só no final do dia. Commits pequenos = menos conflito.
- 📱 **Testar no mobile** (DevTools → 375px) antes de dizer que está pronto.
- 🔑 **Funcionalidades obrigatórias valem 50pts.** Entregue tudo básico funcionando antes de caprichar no visual.
- 📹 **Vídeo:** mostrar o fluxo completo (cadastro → anúncio → proposta → chat → avaliação). 3–5 min.
- 📧 **E-mail de entrega:** `samuel.araujo@ifce.edu.br` com link do GitHub e instrução `npm start`.

---

## 🎯 Se o tempo acabar — prioridade de corte

| Prioridade | Manter | Pode simplificar / cortar |
|---|---|---|
| 🔴 **Crítico** | Login/logout, criar anúncio, listar anúncios, proposta básica (aceitar/recusar) | — |
| 🟡 **Importante** | Filtros, detalhe do anúncio, Garagem Virtual, chat | Chat pode ser só UI sem expiração |
| 🟢 **Desejável** | Contraproposta, avaliações, VATs completos | Avaliação pode ser só salvar estrela sem comentário |
| ⚪ **Bônus** | Dark mode, animações, gráficos, selos | Cortar se necessário — não vale a pena perder tempo |

---

*Equipe 03 · ReVeste — Moda Circular · IFCE · Entrega: Terça-Feira | samuel.araujo@ifce.edu.br*
