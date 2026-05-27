# Meowtion

Projeto de exemplo para reprodução e simulação de reprodução de áudio usando uma API em Node.js (Fastify) e um cliente Expo/React Native chamado Meowtion.

## Resumo

Meowtion é uma aplicação que contém duas partes principais:

- `api/` — backend em Node.js com Fastify para servir dados e endpoints relacionados a músicas.
- `meowtion/` — app cliente feito com Expo (React Native + Expo Router) para dashboard, biblioteca e player.

## Estrutura do repositório

- `api/` — servidor Fastify em TypeScript
- `meowtion/` — app Expo (React Native) com a interface do usuário
- `docker-compose.yml` — orquestração (se aplicável)

Veja a árvore principal do projeto para mais detalhes.

## Tecnologias

- Backend: Node.js, Fastify, TypeScript
- Cliente: Expo, React Native, TypeScript
- Banco de dados: PostgreSQL (depende da configuração do `api`)

## Requisitos

- Node.js 18+ (ou versão compatível com `tsx` e `expo`)
- npm ou yarn
- Expo CLI (para desenvolvimento do app móvel)
- Docker (opcional, caso use `docker-compose`)

## Como rodar localmente

1) Backend (API)

Abra um terminal na pasta `api/` e instale dependências, depois rode em modo desenvolvimento:

```bash
cd api
npm install
npm run dev
```

Os scripts disponíveis no `api/package.json` são:

- `dev`: `tsx watch src/server.ts` (modo desenvolvimento com reload)
- `start`: `tsx src/server.ts` (rodar sem watch)

2) Cliente (app Expo)

Abra outro terminal na pasta `meowtion/` e instale dependências, depois inicie o Expo:

```bash
cd meowtion
npm install
npm run start
```

Comandos úteis do `meowtion/package.json`:

- `start`: `expo start` (abertura do Metro/Expo)
- `android`: `expo start --android`
- `ios`: `expo start --ios`
- `web`: `expo start --web`

Observação: para rodar em dispositivos físicos, instale o aplicativo Expo Go e escaneie o QR code exibido.

## Variáveis de ambiente

O backend pode depender de variáveis de ambiente (ex.: `DATABASE_URL`, `PORT`). Crie um arquivo `.env` em `api/` se necessário. Exemplo mínimo:

```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/meowtion
```

## Estrutura de pastas relevante

- `api/src/server.ts` — ponto de entrada do servidor
- `meowtion/App.tsx` e `meowtion/index.ts` — ponto de entrada do app Expo
- `meowtion/app/` — rotas e telas do Expo Router

## Desenvolvimento e contribuições

- Siga o padrão de código existente (TypeScript)
- Abra uma issue antes de trabalhar em mudanças grandes
- Envie PRs pequenos e bem documentados

## Próximos passos sugeridos

- Adicionar documentação dos endpoints da API
- Configurar e documentar o banco de dados e migrações
- Adicionar testes unitários e de integração

## Licença

Projeto sem licença explícita — adicione uma licença (por exemplo MIT) se desejar tornar o projeto open-source.
