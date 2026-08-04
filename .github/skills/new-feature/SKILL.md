---
name: new-feature
description: "Scaffold a complete feature module for Watch It Together. Use when creating a new feature (auth, movies, groups, profile, etc.). Creates all required folders and boilerplate: components, hooks, pages, schemas, services, types. Follows Feature-First + Clean Architecture pattern."
argument-hint: "<feature-name> e.g. movies, groups, reviews"
---

# New Feature Scaffold

Scaffold a complete, architecture-compliant feature module inside `apps/web/src/features/<name>/`.

## When to Use
- Creating a new product feature (movies, groups, reviews, notifications, etc.)
- Onboarding a new domain into the frontend
- Ensuring a feature starts with the correct folder structure and boilerplate

## Procedure

### 1. Clarify Scope
Ask (or infer from context):
- Feature name (e.g. `reviews`)
- Which backend endpoints it will consume (check `backend/API.md`)
- Main entities involved (e.g. `Review`, `Movie`)

### 2. Create Feature Folder Structure

```
apps/web/src/features/<name>/
  components/       ← Feature-specific React components
  hooks/            ← Custom hooks (TanStack Query wrappers)
  pages/            ← Route-level page components
  schemas/          ← Zod validation schemas
  types/            ← TypeScript interfaces and types (local only)
  index.ts          ← Public API of the feature
```

> Never create a `services/` folder inside features. Repository implementations live in `packages/infrastructure`.

### 3. Create the Domain Entity (if new)

File: `packages/domain/entities/<Entity>.ts`

```ts
export interface <Entity> {
  id: string;
  // ... domain fields (no DTO fields, no null from backend)
}
```

### 4. Create the DTO

File: `packages/application/dto/<Entity>DTO.ts`

```ts
// Mirrors the exact shape returned by the backend
export interface <Entity>DTO {
  id: string;
  // snake_case or whatever the backend returns
}
```

### 5. Create the Mapper

File: `packages/application/mappers/<Entity>Mapper.ts`

```ts
import type { <Entity> } from '@watch-it/domain';
import type { <Entity>DTO } from '../dto/<Entity>DTO';

export const <Entity>Mapper = {
  toDomain(dto: <Entity>DTO): <Entity> {
    return {
      id: dto.id,
      // map all fields
    };
  },
};
```

### 6. Create the Repository Contract

File: `packages/domain/repositories/<Entity>Repository.ts`

```ts
import type { <Entity> } from '../entities/<Entity>';

export interface <Entity>Repository {
  findAll(): Promise<<Entity>[]>;
  findById(id: string): Promise<<Entity>>;
}
```

### 7. Create the Use Case

File: `packages/application/useCases/get<Entity>UseCase.ts`

```ts
import type { <Entity>Repository } from '@watch-it/domain';

export function makeGet<Entity>UseCase(repository: <Entity>Repository) {
  return async function get<Entity>(id?: string) {
    return id ? repository.findById(id) : repository.findAll();
  };
}
```

### 8. Create the Feature Hook

File: `apps/web/src/features/<name>/hooks/use<Entity>.ts`

```ts
import { useQuery } from '@tanstack/react-query';
import { makeGet<Entity>UseCase } from '@watch-it/application';
import { httpMovieRepository } from '@watch-it/infrastructure';

const useCase = makeGet<Entity>UseCase(httpMovieRepository);

export function use<Entity>() {
  return useQuery({
    queryKey: ['<entity>'],
    queryFn: () => useCase(),
  });
}
```

### 9. Create the Page Component

File: `apps/web/src/features/<name>/pages/<Name>Page.tsx`

```tsx
import { use<Entity> } from '../hooks/use<Entity>';

export function <Name>Page() {
  const { data, isLoading, isError } = use<Entity>();

  if (isLoading) return <SkeletonList />;
  if (isError) return <ErrorState message="Unable to load <name>." />;
  if (!data?.length) return <EmptyState />;

  return (
    <Box>
      {data.map((item) => (
        <<Entity>Card key={item.id} <entity>={item} />
      ))}
    </Box>
  );
}
```

### 10. Export the Public API

File: `apps/web/src/features/<name>/index.ts`

```ts
export { <Name>Page } from './pages/<Name>Page';
export { use<Entity> } from './hooks/use<Entity>';
```

### 11. Register Route

Add the route in `apps/web/src/router/` following the routing table in `copilot-instructions.md`.

## Rules to Enforce
- Features never import from other feature folders
- Hooks never call Axios directly — always through a use case
- Pages are thin: they delegate everything to hooks and components
- Every async page must handle: loading, error, empty, and data states
- Spacing: `theme.spacing(n)`, never raw pixels
- Colors: `theme.palette.*`, never hardcoded hex values

## Reference Files
- [Architecture Guide](../../frontend/docs/ARCHTETURE.md)
- [Project Spec](../../frontend/docs/PROJECT_SPEC.md)
- [Backend API](../../backend/API.md)
