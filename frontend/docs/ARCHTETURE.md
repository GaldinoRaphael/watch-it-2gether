# Watch It Together
# Frontend Architecture Guide

Version: 1.0

---

# Table of Contents

1. Philosophy
2. Architecture Overview
3. Layer Responsibilities
4. Folder Structure
5. Feature Architecture
6. Data Flow
7. Component Architecture
8. UI Guidelines
9. State Management
10. API Layer
11. Design System
12. Authentication
13. Forms
14. Error Handling
15. Loading States
16. Naming Conventions
17. File Organization
18. Testing
19. Code Standards
20. React Native Migration
21. Architecture Decisions

---

# Philosophy

The frontend should be easy to understand, scalable and highly reusable.

The application is expected to evolve into multiple clients:

- Web
- Mobile (React Native)

Because of this, business logic must be isolated from the UI.

React is responsible only for rendering.

The Application layer is responsible for orchestrating.

The Domain layer is responsible for business rules.

---

# Architecture Overview

```
React Components

↓

Hooks

↓

Application Use Cases

↓

Repositories

↓

Infrastructure

↓

Backend
```

React never talks directly to Axios.

---

# Layers

## Domain

Contains only business rules.

Examples

```
Movie

Group

Review

User
```

Also contains

```
Enums

Value Objects

Repository Contracts

Errors
```

The Domain layer must never depend on React.

---

## Application

Contains

```
Use Cases

DTOs

Commands

Queries

Mappers
```

Example

```
SearchMovieUseCase

↓

MovieRepository

↓

Movie[]
```

No React code should exist here.

---

## Infrastructure

Responsible for implementation.

Example

```
Axios

↓

MovieApiRepository

↓

MovieRepository
```

Infrastructure may depend on external libraries.

---

## UI

Contains reusable components.

```
Button

Input

Avatar

Toast

Dialog

MovieCard

GroupCard
```

UI must not contain business rules.

---

# Folder Structure

```
apps/

    web/

packages/

    domain/

    application/

    infrastructure/

    ui/

    design-system/

    shared/
```

---

# Web Structure

```
src/

app/

features/

layouts/

providers/

router/

pages/

styles/
```

---

# Feature Structure

Every feature is isolated.

Example

```
movies/

components/

hooks/

pages/

schemas/

services/

types/
```

Feature folders should not access each other directly.

Communication should happen through packages.

---

# Data Flow

Correct

```
Page

↓

Hook

↓

Use Case

↓

Repository

↓

API

↓

Backend
```

Incorrect

```
Page

↓

Axios
```

---

# Hooks

Hooks orchestrate UI.

They should

- call use cases

- expose loading

- expose data

- expose errors

Example

```
const { movies, loading } = useMovies();
```

Hooks should not perform business validation.

---

# Components

There are four component categories.

## Base Components

Reusable UI.

Examples

```
Button

Input

TextField

Avatar
```

---

## Composite Components

Combination of base components.

Examples

```
MovieCard

GroupCard

RatingStars

ReviewCard
```

---

## Layout Components

Examples

```
Header

Sidebar

Page

Container
```

---

## Feature Components

Specific to one feature.

Example

```
MovieSearch

ReviewForm
```

---

# Component Rules

A component should have only one responsibility.

Bad

```
MovieCard

+

Movie Search

+

Movie Delete

+

Movie Review
```

Good

```
MovieCard

MovieActions

MovieRating
```

---

# Props

Prefer

```
<MovieCard movie={movie} />
```

Avoid

```
<MovieCard

title

poster

year

rating

director

genre

...
```

---

# Styling

Use Material Theme.

Never use inline styles.

Prefer

```
sx

styled()

theme
```

Spacing

Always multiples of 8.

---

# Theme

The application supports

Dark

Light

Colors should never be hardcoded.

Use

```
theme.palette.primary.main
```

Never

```
"#6200EE"
```

---

# State Management

Server State

TanStack Query

Client State

Context API

Avoid global state unless necessary.

---

# Contexts

Allowed

```
Theme

Authentication

Snackbar

```

Avoid contexts for feature data.

---

# API Layer

Every endpoint follows

```
DTO

↓

Mapper

↓

Repository

↓

Use Case
```

Never expose API responses directly.

---

# DTOs

DTOs represent backend contracts.

Never use DTOs inside components.

Always convert

DTO

↓

Domain Entity

---

# Validation

Use

React Hook Form

+

Zod

Validation belongs to forms.

Business rules belong to Domain.

---

# Errors

Expected errors

Show friendly messages.

Unexpected errors

Log

Display fallback UI.

Never expose backend exceptions.

---

# Loading

Every async page must implement

Skeleton

Loading

Error

Empty State

---

# Dialogs

Dialogs should be controlled.

Avoid local boolean states scattered around.

Prefer

```
DialogProvider
```

when applicable.

---

# Toasts

Transient messages only.

Never use to communicate critical information.

---

# Navigation

Navigation is hierarchical.

```
Home

↓

Group

↓

Movie

↓

Review
```

Avoid deep nested routes.

---

# Naming

Components

PascalCase

Hooks

camelCase

Types

PascalCase

Interfaces

PascalCase

Enums

PascalCase

Files

Match exported symbol.

---

# Imports

Prefer

```
import { Button } from "@ui";
```

instead of

```
../../../components/Button
```

---

# Barrel Files

Allowed.

Prefer

```
index.ts
```

inside folders.

---

# Testing

Test

Use Cases

Hooks

Critical Components

Repository implementations

Avoid snapshot abuse.

---

# Accessibility

Interactive elements

Minimum

44x44

Buttons

Must have labels.

Inputs

Must have labels.

Dialogs

Must trap focus.

---

# Performance

Use lazy loading.

Virtualize long lists.

Memoize only when necessary.

Avoid premature optimization.

---

# React Native Migration

Everything below should be reusable.

```
Domain

Application

Infrastructure

Shared

Design Tokens
```

Only UI changes.

```
packages/ui

↓

Material UI

↓

React Native Paper
```

The API should remain identical.

---

# Architecture Decisions

## Why Feature First?

Keeps related files together.

Improves scalability.

---

## Why Clean Architecture?

Business logic survives framework changes.

---

## Why React Query?

Server state is not global state.

---

## Why Context instead of Redux?

Smaller application.

Less boilerplate.

---

## Why Wrapper Components?

Material UI will eventually be replaced.

Wrapping components avoids vendor lock.

---

# Principles

The UI should never know how business works.

Business should never know how UI works.

Everything should be replaceable.

Every feature should be independently testable.

Prefer composition over inheritance.

Prefer explicit code over magic.

Optimize for readability first.
