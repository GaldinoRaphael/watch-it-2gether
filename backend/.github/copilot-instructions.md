# Watch It 2gether — Backend

## Visão geral

API REST em **Node.js + TypeScript** para a aplicação Watch It 2gether, onde usuários criam grupos e votam em filmes para assistir juntos. Utiliza **Express 5**, **Prisma 7** com PostgreSQL e segue arquitetura em camadas (Clean Architecture).

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js + TypeScript 5 |
| Framework HTTP | Express 5 |
| ORM | Prisma 7 (adapter `@prisma/adapter-pg`) |
| Banco de dados | PostgreSQL |
| Autenticação | JWT (`jsonwebtoken`) |
| Hash de senha | bcrypt (`Bcrypter`) |
| HTTP externo | Axios (cliente IMDB API) |
| Documentação | Swagger (swagger-jsdoc + swagger-ui-express) |

## Estrutura de diretórios

```
src/
  @types/express/        # Extensão do Request com req.user
  application/
    dto/                 # Data Transfer Objects
    useCases/            # Casos de uso (regras de negócio)
  domain/
    entities/            # Entidades de domínio com validações
    repositories/        # Interfaces/gateways do domínio
    value-objects/       # Value objects (Id, UserId, etc.)
  infrastructure/
    criptography/        # Implementação bcrypt
    database/prisma/     # PrismaService + cliente gerado
    gateways/            # Cliente externo (IMDB API)
    http/
      controllers/       # Controllers Express
      mappers/           # Conversão domain <-> DTO <-> Prisma
      middleware/        # authMiddleware (JWT)
      routes/            # Definição de rotas e JSDoc Swagger
  ports/
    cryptography/        # Interface PasswordHasher
    repositories/        # Implementações dos repositórios
  main/
    server.ts            # Entry point (Express app + graceful shutdown)
prisma/
  schema.prisma          # Modelos: User, Group, GroupMember, Movie, Vote, Commentary
```

## Modelos do banco (Prisma)

- **User** — id, name, email (unique), passwordHash, createdAt
- **Group** — id, name, ownerId → User
- **GroupMember** — id, groupId, userId (unique por par)
- **Movie** — id, externalId (unique), title, year, posterUrl, provider
- **Vote** — id, userId, groupId, movieId, rating (Float); unique por (userId, groupId, movieId)
- **Commentary** — id, userId, voteId, content, createdAt

## Rotas disponíveis

| Método | Rota | Descrição |
|---|---|---|
| POST | `/user/register` | Cadastro de usuário |
| POST | `/user/login` | Login (retorna JWT) |
| GET | `/groups` | Lista todos os grupos |
| GET | `/groups/:id` | Busca grupo por ID |
| POST | `/groups` | Cria grupo |
| GET | `/movies` | Lista filmes |
| GET | `/movies/search` | Busca filme na IMDB API |
| GET | `/votes` | Lista votos |
| GET | `/votes/:id` | Busca voto por ID |
| POST | `/votes` | Registra voto |
| GET | `/api-docs` | Documentação Swagger UI |

## Convenções de código

- **Nomenclatura de arquivos**: `kebab-case` com sufixo do papel (`-controller`, `-use-case`, `-repository`, `-mapper`, `-entity`, etc.)
- **Injeção de dependência**: feita manualmente nas rotas (sem container IoC)
- **Validações**: funções utilitárias em `entity-validation.ts` (`assertDefined`, `assertNonEmptyString`, `assertEmailFormat`, `assertValidDateString`)
- **Autenticação**: `authMiddleware` valida JWT do header `Authorization: Bearer <token>` e popula `req.user.id` e `req.user.email`
- **Documentação**: anotações `@openapi` no JSDoc dentro dos arquivos de rotas
- **Geração do cliente Prisma**: output em `src/infrastructure/database/prisma/generated`

## Scripts

```bash
npm run dev      # nodemon com hot-reload (ts-node)
npm run compile  # tsc (compila para dist/)
npm start        # node ./dist/server.js
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `PORT` | Porta do servidor (padrão: 3000) |
| `JWT_SECRET` | Segredo para assinar/verificar tokens JWT |
| `DATABASE_URL` | Connection string do PostgreSQL |
