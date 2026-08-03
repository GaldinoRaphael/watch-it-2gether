# Watch It 2gether — API Reference

**Base URL:** `http://localhost:3000`  
**Documentação interativa:** `GET /api-docs` (Swagger UI)

---

## Autenticação

Todas as rotas marcadas com 🔒 exigem o header:

```
Authorization: Bearer <token>
```

O token JWT é obtido em `POST /user/login` ou `POST /user/register` e expira em **7 dias**.

---

## Respostas de Erro Padrão

| Status | Quando ocorre                                            |
| ------ | -------------------------------------------------------- |
| `400`  | Body inválido (falha na validação Zod)                   |
| `401`  | Token ausente ou inválido                                |
| `404`  | Recurso não encontrado                                   |
| `409`  | Conflito (ex: e-mail já cadastrado, usuário já é membro) |
| `429`  | Rate limit atingido                                      |
| `500`  | Erro interno                                             |

```json
// Erro de validação (400)
{
  "error": "Validation Error",
  "details": { "email": ["Invalid email"] }
}

// Erro genérico
{
  "error": "Not Found",
  "errorMessage": "User not found"
}
```

---

## Users

### `POST /user/register`

Cria um novo usuário e retorna token + dados do usuário.

**Body:**

```json
{
  "name": "João",
  "email": "joao@example.com",
  "password": "minimo6chars"
}
```

**Response `201`:**

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "name": "João",
    "email": "joao@example.com"
  }
}
```

---

### `POST /user/login`

Autentica o usuário. Rate limit: **10 req / 15 min por IP**.

**Body:**

```json
{
  "email": "joao@example.com",
  "password": "minimo6chars"
}
```

**Response `200`:**

```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "name": "João",
    "email": "joao@example.com"
  }
}
```

---

### `GET /user/me` 🔒

Retorna o perfil do usuário autenticado.

**Response `200`:**

```json
{
  "id": "uuid",
  "name": "João",
  "email": "joao@example.com"
}
```

---

## Groups

### `GET /groups`

Lista todos os grupos.

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "name": "Filmes de Sexta",
    "ownerId": "uuid",
    "createdAt": "2026-08-02T00:00:00.000Z"
  }
]
```

---

### `GET /groups/:id`

Retorna um grupo pelo ID.

**Response `200`:** objeto `Group` | `404`

---

### `POST /groups` 🔒

Cria um novo grupo.

**Body:**

```json
{
  "name": "Filmes de Sexta",
  "ownerId": "uuid-do-usuario"
}
```

**Response `201`:** objeto `Group`

---

### `PUT /groups/:id` 🔒

Atualiza um grupo existente.

**Body (todos opcionais):**

```json
{
  "name": "Novo nome",
  "ownerId": "uuid"
}
```

**Response `200`:** objeto `Group` | `404`

---

### `DELETE /groups/:id` 🔒

Remove um grupo e todos os seus votos, comentários e membros.

**Response `204`** | `404`

---

## Group Members

### `GET /groups/:groupId/members` 🔒

Lista os membros de um grupo.

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "groupId": "uuid",
    "userId": "uuid",
    "joinedAt": "2026-08-02T00:00:00.000Z"
  }
]
```

---

### `POST /groups/:groupId/members` 🔒

O usuário autenticado entra no grupo. O `userId` é extraído do token JWT.

**Body:** nenhum

**Response `201`:** objeto `GroupMember` | `409` (já é membro)

---

### `DELETE /groups/:groupId/members` 🔒

O usuário autenticado sai do grupo.

**Response `204`** | `404` (não é membro)

---

## Movies

### `GET /movies/search?query=...`

Busca filmes na API externa (IMDB). Rate limit: **30 req / 1 min por IP**.

**Query params:**

- `query` (string, obrigatório) — texto de busca

**Response `200`:**

```json
[
  {
    "externalId": "tt1234567",
    "title": "Inception",
    "year": "2010",
    "posterUrl": "https://..."
  }
]
```

---

### `GET /movies/db`

Lista todos os filmes salvos no banco local.

**Response `200`:** array de `Movie`

---

### `GET /movies/db/:id`

Busca um filme salvo pelo ID interno.

**Response `200`:** objeto `Movie` | `404`

---

### `GET /movies/db/external/:externalId`

Busca um filme salvo pelo `externalId` (ID do IMDB).

**Response `200`:** objeto `Movie` | `404`

---

### `POST /movies/db` 🔒

Salva um filme no banco local.

**Body:**

```json
{
  "externalId": "tt1234567",
  "title": "Inception",
  "year": "2010",
  "posterUrl": "https://..." // opcional
}
```

**Response `201`:** objeto `Movie`

---

### `PUT /movies/db/:id` 🔒

Atualiza um filme salvo.

**Body (todos opcionais):**

```json
{
  "title": "Novo título",
  "year": "2011",
  "posterUrl": "https://..."
}
```

**Response `200`:** objeto `Movie` | `404`

---

### `DELETE /movies/db/:id` 🔒

Remove um filme salvo.

**Response `204`** | `404`

---

## Votes

> Existem dois conjuntos de endpoints de voto:
>
> - `/vote` — endpoint de **negócio** (busca o filme no IMDB se necessário, cria voto + comentário)
> - `/votes` — CRUD direto no banco

### ⭐ `POST /vote` 🔒 _(endpoint principal)_

Registra ou atualiza o voto de um usuário em um filme dentro de um grupo. Busca o filme automaticamente na IMDB API se ele ainda não estiver no banco.

**Body:**

```json
{
  "userId": "uuid",
  "groupId": "uuid",
  "externalId": "tt1234567",
  "rating": 8.5,
  "commentary": "Muito bom!" // opcional, default ""
}
```

**Response `200`:** objeto `Vote`

---

### ⭐ `PUT /vote/:id` 🔒 _(endpoint principal)_

Atualiza um voto existente pelo ID do voto.

**Body:** mesmo schema de `POST /vote`

**Response `200`:** objeto `Vote` | `404`

---

### `GET /groups/:groupId/votes` 🔒

Lista os votos de um grupo ordenados por **rating decrescente** (ranking).

**Response `200`:** array de `Vote` ordenado por rating

---

### `GET /votes`

Lista todos os votos no banco.

**Response `200`:** array de `Vote`

---

### `GET /votes/:id`

Busca um voto pelo ID.

**Response `200`:** objeto `Vote` | `404`

---

### `POST /votes` 🔒

Cria um voto diretamente no banco (sem lógica de busca de filme).

**Body:**

```json
{
  "userId": "uuid",
  "groupId": "uuid",
  "movieId": "uuid",
  "rating": 8.5,
  "commentary": "Texto opcional"
}
```

**Response `201`:** objeto `Vote`

---

### `PUT /votes/:id` 🔒

Atualiza um voto diretamente no banco.

**Body (todos opcionais):** mesmos campos de `POST /votes`

**Response `200`:** objeto `Vote` | `404`

---

### `DELETE /votes/:id` 🔒

Remove um voto e seu comentário.

**Response `204`** | `404`

---

## Schemas de Resposta

```typescript
// User
{
  id: string; // UUID
  name: string;
  email: string;
  createdAt: string; // ISO 8601
}

// Group
{
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

// GroupMember
{
  id: string;
  groupId: string;
  userId: string;
  joinedAt: string;
}

// Movie
{
  id: string;
  externalId: string;
  title: string;
  year: string;
  posterUrl: string | null;
  provider: string | null;
  createdAt: string;
}

// Vote
{
  id: string;
  userId: string;
  groupId: string;
  movieId: string;
  rating: number; // 0–10
  commentaryId: string;
  commentary: string;
  createdAt: string;
}
```

---

## Regras de Negócio

| Regra                                           | Endpoint                              |
| ----------------------------------------------- | ------------------------------------- |
| Usuário pode entrar em um grupo apenas uma vez  | `POST /groups/:groupId/members` → 409 |
| Usuário só pode sair do grupo por conta própria | `DELETE /groups/:groupId/members`     |
| Voto único por (userId, groupId, movieId)       | `POST /vote` atualiza se já existir   |
| Filme buscado do IMDB é cacheado no banco       | `POST /vote`                          |
| Deletar grupo remove votos e membros em cascata | `DELETE /groups/:id`                  |
| Token expira em 7 dias                          | `POST /user/login`                    |
