---
name: api-endpoint
description: "Wire up a backend endpoint end-to-end in Watch It Together. Use when integrating a new backend API route: creates DTO, Mapper, Repository contract, Repository implementation, Use Case, and React hook with TanStack Query. Follows the mandatory chain: Page → Hook → UseCase → Repository → HTTP Client → Backend."
argument-hint: "<verb> <entity> e.g. list movies, get group, vote movie"
---

# API Endpoint Integration

Wire up a backend endpoint across all required layers — from raw HTTP response to a ready-to-use React hook.

## When to Use
- Integrating a new backend API route for the first time
- A feature needs to fetch or mutate data and there is no use case yet
- Ensuring a data flow is fully compliant with Clean Architecture

## Pre-requisites
Identify from `backend/API.md`:
- HTTP method and path (e.g. `GET /groups/:id/movies`)
- Request payload shape (if any)
- Response payload shape

---

## Procedure

### 1. Define the DTO

File: `packages/application/dto/<Entity>DTO.ts`

```ts
// Mirrors the exact JSON shape returned by the backend. No transformations here.
export interface <Entity>DTO {
  id: string;
  created_at: string; // keep backend names as-is
}
```

If there are nested objects, define a sub-DTO for each.

---

### 2. Define the Domain Entity

File: `packages/domain/entities/<Entity>.ts`

```ts
// Clean domain object. No backend concerns, no raw dates, no null.
export interface <Entity> {
  id: string;
  createdAt: Date;
}
```

---

### 3. Create the Mapper

File: `packages/application/mappers/<Entity>Mapper.ts`

```ts
import type { <Entity> } from '@watch-it/domain';
import type { <Entity>DTO } from '../dto/<Entity>DTO';

export const <Entity>Mapper = {
  toDomain(dto: <Entity>DTO): <Entity> {
    return {
      id: dto.id,
      createdAt: new Date(dto.created_at),
    };
  },
};
```

---

### 4. Define the Repository Contract

File: `packages/domain/repositories/<Entity>Repository.ts`

```ts
import type { <Entity> } from '../entities/<Entity>';

// Pure interface — no Axios, no HTTP, no implementation details
export interface <Entity>Repository {
  findAll(): Promise<<Entity>[]>;
  findById(id: string): Promise<<Entity>>;
}
```

---

### 5. Implement the HTTP Repository

File: `packages/infrastructure/repositories/http<Entity>Repository.ts`

```ts
import { httpClient } from '../http/httpClient'; // shared Axios instance
import { <Entity>Mapper } from '@watch-it/application';
import type { <Entity>DTO } from '@watch-it/application';
import type { <Entity>Repository } from '@watch-it/domain';

export const http<Entity>Repository: <Entity>Repository = {
  async findAll() {
    const { data } = await httpClient.get<{ data: <Entity>DTO[] }>('/<entities>');
    return data.data.map(<Entity>Mapper.toDomain);
  },

  async findById(id: string) {
    const { data } = await httpClient.get<{ data: <Entity>DTO }>(`/<entities>/${id}`);
    return <Entity>Mapper.toDomain(data.data);
  },
};
```

---

### 6. Create the Use Case

**Query (read)**

File: `packages/application/useCases/get<Entities>UseCase.ts`

```ts
import type { <Entity>Repository } from '@watch-it/domain';

export function makeGet<Entities>UseCase(repository: <Entity>Repository) {
  return () => repository.findAll();
}
```

**Mutation (write)**

File: `packages/application/useCases/create<Entity>UseCase.ts`

```ts
import type { <Entity>Repository } from '@watch-it/domain';
import type { Create<Entity>Command } from '../commands/Create<Entity>Command';

export function makeCreate<Entity>UseCase(repository: <Entity>Repository) {
  return (command: Create<Entity>Command) => repository.create(command);
}
```

---

### 7. Create the React Hook

**Query hook**

File: `apps/web/src/features/<name>/hooks/use<Entities>.ts`

```ts
import { useQuery } from '@tanstack/react-query';
import { makeGet<Entities>UseCase } from '@watch-it/application';
import { http<Entity>Repository } from '@watch-it/infrastructure';

const getAll = makeGet<Entities>UseCase(http<Entity>Repository);

export function use<Entities>() {
  return useQuery({
    queryKey: ['<entities>'],
    queryFn: getAll,
  });
}
```

**Mutation hook**

File: `apps/web/src/features/<name>/hooks/useCreate<Entity>.ts`

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeCreate<Entity>UseCase } from '@watch-it/application';
import { http<Entity>Repository } from '@watch-it/infrastructure';

const create = makeCreate<Entity>UseCase(http<Entity>Repository);

export function useCreate<Entity>() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['<entities>'] });
    },
  });
}
```

---

## Error Handling Rules
- Never surface backend error messages in the UI — display friendly strings
- Example: `"Unable to load your movies."` not `error.response.data.message`
- Use TanStack Query's `isError` in the hook consumer (the page/component)
- Domain-level errors live in `packages/domain/errors/`

## Checklist
- [ ] DTO matches exact backend response shape
- [ ] Mapper converts every DTO field — no raw DTOs leak into React
- [ ] Repository contract has zero Axios/HTTP references
- [ ] HTTP Repository never used directly in React components
- [ ] Hook uses `queryKey` that uniquely identifies the data
- [ ] Mutation hook invalidates affected queries on success

## Reference Files
- [Architecture Guide](../../frontend/docs/ARCHTETURE.md)
- [Backend API](../../backend/API.md)
- [Project Spec](../../frontend/docs/PROJECT_SPEC.md)
