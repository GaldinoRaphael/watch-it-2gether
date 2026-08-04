# Watch It Together - Frontend Project Specification

Version: 1.0
Status: Draft
Target: Web (V0) with future React Native migration

---

# 1. Objective

Develop a modern, scalable and maintainable frontend architecture for the Watch It Together application.

The first release targets the Web platform using React.

The architecture **must be designed from day one** to maximize code sharing with a future React Native application.

The goal is that business logic, validations, DTOs, API communication and design tokens are shared between Web and Mobile.

---

# 2. Core Principles

The project must follow these principles:

- Mobile First
- Feature First
- Domain Driven Design (Frontend)
- Clean Architecture
- SOLID
- Composition over inheritance
- Atomic reusable components
- Accessibility first
- Type safety everywhere
- Zero duplicated business rules

---

# 3. Technology Stack

## Monorepo

- pnpm Workspace
- Turborepo

---

## Web

- React
- TypeScript
- Vite

---

## Routing

React Router

---

## UI

Material UI

Material Symbols

---

## Styling

Material Theme

CSS Variables

---

## Forms

React Hook Form

Zod

---

## Server State

TanStack Query

---

## HTTP

Axios

---

## Testing

Vitest

React Testing Library

MSW

---

## Quality

ESLint

Prettier

Husky

lint-staged

---

# 4. Folder Structure

```
watch-it-together

apps/
    web/

packages/

    application/

    domain/

    infrastructure/

    ui/

    design-system/

    shared/

package.json

turbo.json

pnpm-workspace.yaml
```

---

# 5. Layer Responsibilities

## Domain

Contains:

- Entities
- Value Objects
- Enums
- Repository Contracts
- Domain Errors

The Domain layer MUST NOT depend on React.

---

## Application

Contains:

- Use Cases
- DTOs
- Commands
- Queries
- Mappers

The Application layer MUST NOT depend on React.

---

## Infrastructure

Contains:

- HTTP Client
- API implementations
- Authentication
- Storage
- Environment

---

## UI

Contains reusable UI components.

Examples:

- Button
- Card
- Input
- Avatar
- Modal
- Toast
- RatingStars
- SearchInput

UI components must never contain business logic.

---

## Design System

Contains:

Theme

Colors

Spacing

Elevation

Typography

Radius

Icons

Dark Theme

Light Theme

---

## Shared

Contains generic utilities.

Examples:

- helpers
- constants
- validators
- date
- string
- formatters

---

# 6. Web Folder Structure

```
src/

app/

features/

layouts/

providers/

router/

hooks/

pages/

assets/

styles/
```

---

# 7. Feature Structure

Every feature should be isolated.

Example:

```
features/

groups/

    components/

    hooks/

    services/

    schemas/

    pages/

    types/

movies/

reviews/

auth/

profile/
```

---

# 8. Routing

```
/

login

register

groups

groups/:groupId

groups/:groupId/add-movie

groups/:groupId/movie/:movieId

profile
```

---

# 9. State Management

Server State

TanStack Query

Client State

Context API

Do NOT use Redux.

---

# 10. HTTP Architecture

Pages

↓

Hooks

↓

Application Use Cases

↓

Repositories

↓

HTTP Client

Never call Axios directly inside React components.

---

# 11. Components

Components must be divided into:

Common

Layout

Movie

Group

Review

Feedback

Navigation

Every reusable component should expose a simple API.

Example:

```
<Button>

<MovieCard>

<RatingStars>

<GroupCard>
```

Never expose Material UI components directly.

Wrap Material UI inside custom components.

Example:

```
packages/ui/Button

↓

Material UI Button
```

Future React Native implementation should keep the same component API.

---

# 12. Design Rules

Default theme:

Dark

Future:

Light Theme

Spacing should follow an 8px grid.

Corner radius:

Medium

Animations:

150ms - 250ms

Cards should use low elevation.

Avoid excessive shadows.

---

# 13. Mobile First

Every page should be designed mobile first.

Breakpoints:

Mobile

Tablet

Desktop

Avoid desktop-only layouts.

---

# 14. Accessibility

Minimum touch target:

44px

Support keyboard navigation.

Support screen readers.

Maintain proper contrast ratio.

---

# 15. Forms

Always use:

React Hook Form

+

Zod

Never use uncontrolled validation.

---

# 16. Internationalization

Prepare the project for multiple languages.

Use:

react-i18next

Default language:

Portuguese

---

# 17. Error Handling

Errors should never expose backend messages.

Display friendly messages.

Example:

"Unable to load your movies."

---

# 18. Loading States

Every asynchronous page must provide:

Skeleton

Loading

Error

Empty State

---

# 19. Authentication

Authentication should be isolated.

Suggested structure:

```
auth/

services/

hooks/

context/

guards/
```

---

# 20. Environment

Never access process.env directly.

Create:

Environment Service

---

# 21. API Layer

Every backend endpoint should have:

DTO

Mapper

Repository

Service

Never expose raw API responses to React components.

---

# 22. Code Style

Prefer:

Composition

Small components

Pure functions

Early returns

Named exports

Avoid:

God Components

Business logic inside JSX

Large files

Magic numbers

Inline styles

---

# 23. Naming

Components

PascalCase

Hooks

camelCase

Files

PascalCase for components

camelCase for utilities

Constants

UPPER_CASE

---

# 24. Future React Native Migration

The architecture should maximize code reuse.

The following must be shared:

- Entities
- Use Cases
- DTOs
- Repository Contracts
- Validation Schemas
- Constants
- Helpers
- Design Tokens
- Theme
- API Client
- Models

Only platform-specific UI should change.

---

# 25. Definition of Done

Every feature must include:

- UI
- Loading state
- Error state
- Empty state
- Validation
- Responsive layout
- Accessibility
- Unit tests

---

# 26. Long-term Goal

The project should evolve into:

apps/

web

mobile

sharing approximately 80–90% of business logic.

The Web version should never implement business rules that cannot be reused by the future React Native application.