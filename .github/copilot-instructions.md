# Watch It Together — Copilot Instructions

## Project Overview
Watch It Together is a monorepo (pnpm + Turborepo) where groups of friends decide which movie to watch together. Stack: React, TypeScript, Vite, Material UI, TanStack Query, React Hook Form, Zod, Axios.

## Architecture — Non-Negotiable Rules

### Data Flow
Every data request MUST follow this chain. No shortcuts.
```
Page → Hook → Use Case → Repository → HTTP Client → Backend
```

### Layer Boundaries
| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| `packages/domain` | Entities, Value Objects, Enums, Repository contracts, Domain Errors | React, Axios, any external lib |
| `packages/application` | Use Cases, DTOs, Mappers, Commands, Queries | React, Axios |
| `packages/infrastructure` | Axios, HTTP implementations, Auth, Storage | React hooks |
| `packages/ui` | Reusable components wrapping MUI | Business logic |
| `features/**` | Feature-scoped components, hooks, pages, schemas | Direct Axios calls |

### Forbidden Patterns (always flag these)
- Calling Axios directly inside a React component or custom hook
- Using raw DTO types inside React components — always map to domain entities first
- Hardcoded color values like `"#6200EE"` — always use `theme.palette.*`
- `import Redux` — use TanStack Query for server state, Context API for client state
- Business validation logic inside JSX or hooks — belongs to Domain or Use Case
- Inline `style={{}}` — use `sx`, `styled()`, or `theme`
- Importing one feature folder from another — communicate through `packages/`

## Monorepo Structure
```
apps/web/src/
  features/          ← feature modules (auth, movies, groups, profile)
  layouts/           ← Header, Sidebar, Page wrappers
  providers/         ← ThemeProvider, QueryClientProvider, AuthContext
  router/            ← React Router config
  pages/             ← Route entry points, thin wrappers around feature pages

packages/
  domain/            ← Entities, contracts, errors (zero deps)
  application/       ← Use cases, DTOs, mappers (zero React)
  infrastructure/    ← Axios, repositories, env service
  ui/                ← Wrapped MUI components with project API
  design-system/     ← Theme, colors, typography, spacing tokens
  shared/            ← Pure helpers, formatters, validators
```

## MUI Usage Rules
- **Never** expose MUI components directly in feature/page code
- Always wrap MUI inside `packages/ui` with a project-specific API:
  ```tsx
  // Good: packages/ui/Button.tsx wraps MUI Button
  // Feature code imports from packages/ui, not from @mui/material
  import { Button } from '@watch-it/ui';
  ```
- The wrapped API must be React Native-compatible in shape (no web-only props in the contract)

## Spacing
Always multiples of 8px. Use `theme.spacing(n)` — never raw pixel values.

## Theme
- Default theme: **Dark**
- Colors always from `theme.palette.*` — never hardcoded
- Corner radius: medium (`theme.shape.borderRadius`)
- Animation duration: 150ms–250ms

## Routing (Web V0)
```
/                      ← redirect to /groups or /login
/login
/register
/groups
/groups/:groupId
/groups/:groupId/add-movie
/groups/:groupId/movie/:movieId
/profile
```

## Authentication
All auth logic lives in `features/auth/`. Components consume `useAuth()` hook only.
Route guards live in `features/auth/guards/`.

## API Backend
Base URL configured via Environment Service — never `process.env` directly.
Backend runs on `http://localhost:3000`. See `backend/API.md` for endpoints.
