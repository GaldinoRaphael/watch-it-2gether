---
name: feature-movies
description: "Build the Movies feature for Watch It Together. Covers: Add Movie flow (search + confirm), and Movie Detail page. Includes debounced search, poster display, per-user reviews, and the rating-to-backend mapping rule."
argument-hint: "add-movie | movie-detail"
---

# Feature: Movies

Covers three screens: **Adicionar Filme** (search), **Confirmação do Filme**, and **Detalhes do Filme**.

---

## UX/UI Spec

### Screen 1 — Adicionar Filme (Movie Search)

Accessed via "＋ Adicionar Filme" from the group detail page.

**Layout:**
- Full-page or modal with a search input at the top
- Results list below (compact `SearchResultItem` cards)
- Empty prompt: "Digite o nome do filme para buscar"
- No results: "Nenhum filme encontrado."
- Loading: skeleton list items

**Search behavior:**
- Debounce: **300ms**
- Minimum characters: **2**
- Calls `GET /movies/search?query=<term>` (external IMDB, rate-limited: 30 req/min)
- Do NOT call on every keystroke — only after debounce + min length

**SearchResultItem card:**
```
[poster 40×56 rounded] | Title (body1 bold) | Year (body2, text.secondary)
```
Pressing an item navigates to the confirmation screen with the selected movie data passed via router state.

---

### Screen 2 — Confirmação do Filme

Shown after selecting a movie from search. Confirm before adding to the group.

**Layout:**
- Large poster (center, 120×180, rounded corners)
- Title (h3)
- Year (body2, text.secondary)
- "Data assistida" date field — pre-filled with today, editable (use MUI DatePicker or a simple date input)
- Primary button: "Adicionar ao grupo"
- Ghost button: "Voltar"

**On confirm:**
- Call `POST /vote` (the main business endpoint — it saves the movie to DB and creates the vote simultaneously)
- After success: navigate back to group detail

> `POST /vote` handles everything: it fetches the movie from IMDB if needed, saves to the local DB, and creates the vote record.

---

### Screen 3 — Detalhes do Filme (Movie Detail)

Accessed from `MovieListItem` in the group detail.

**Layout:**
- Poster (large, 2:3 aspect ratio, top)
- Title (h2), Year (body2)
- Group average rating: `RatingStars` (lg size) + numeric ("4.5 / 5")
- Section: "Avaliações do grupo"
  - `UserReviewCard` for each member who voted
- Button: "Ver detalhes do filme" → opens a Dialog with IMDB info

**"Ver detalhes" Dialog content:**
- Director, Genre, Runtime, Synopsis
- Data comes from the IMDB API response cached in the local DB

---

## Architecture Chain

```
Page → Hook → UseCase → Repository → HTTP Client → Backend
```

### API Endpoints

| Action | Method | Path | Auth | Notes |
|---|---|---|---|---|
| Search movies | `GET` | `/movies/search?query=` | No | IMDB external; rate-limited |
| Get movie by DB id | `GET` | `/movies/db/:id` | No | |
| Get movie by IMDB id | `GET` | `/movies/db/external/:externalId` | No | |
| **Add movie + vote** | `POST` | `/vote` | 🔒 | Main endpoint — use this |
| Get group votes | `GET` | `/groups/:groupId/votes` | 🔒 | Includes movie data |

> Always use `POST /vote` to add a movie to a group. Never call `POST /movies/db` directly from a feature hook — it bypasses business logic.

---

### Backend response schemas

```ts
// MovieSummary (from search)
{ externalId: string; title: string; year: string; posterUrl: string }

// Movie (from DB)
{ id: string; externalId: string; title: string; year: string;
  posterUrl: string | null; provider: string | null; createdAt: string }

// Vote (includes movie data via join — verify in /api-docs)
{ id: string; userId: string; groupId: string; movieId: string;
  rating: number; commentary: string; createdAt: string }
```

### ⭐ Rating Mapping Rule — critical

The backend stores ratings as **0–10**. The UI shows **0–5 stars** (0.5 increments).

```ts
// UI → Backend (before POST /vote)
const backendRating = uiRating * 2;   // 4.5 stars → 9.0

// Backend → UI (when reading votes)
const uiRating = vote.rating / 2;     // 9.0 → 4.5 stars
```

Apply this mapping in the **Mapper layer**, never in components.

---

### DTOs

```ts
// packages/application/src/dto/MovieSummaryDTO.ts
interface MovieSummaryDTO {
  externalId: string;
  title: string;
  year: string;
  posterUrl: string;
}

// packages/application/src/dto/MovieDTO.ts
interface MovieDTO {
  id: string;
  externalId: string;
  title: string;
  year: string;
  posterUrl: string | null;
  provider: string | null;
  createdAt: string;
}

// packages/application/src/dto/VoteDTO.ts
interface VoteDTO {
  id: string;
  userId: string;
  groupId: string;
  movieId: string;
  rating: number;   // 0–10
  commentary: string;
  createdAt: string;
}
```

---

### Files to create

```
packages/domain/src/entities/MovieSummary.ts     ← search result entity
packages/application/src/dto/MovieSummaryDTO.ts
packages/application/src/dto/VoteDTO.ts          (check if exists)
packages/application/src/mappers/MovieMapper.ts
packages/application/src/mappers/VoteMapper.ts   ← applies ÷2 mapping
packages/application/src/useCases/searchMoviesUseCase.ts
packages/application/src/useCases/addMovieToGroupUseCase.ts
packages/infrastructure/src/repositories/httpMovieRepository.ts

apps/web/src/features/movies/
  schemas/addMovieSchema.ts     ← externalId + groupId + rating (optional at this step)
  hooks/useMovieSearch.ts       ← useQuery with debounce, enabled: query.length >= 2
  hooks/useAddMovieToGroup.ts   ← useMutation wrapping addMovieToGroupUseCase
  hooks/useGroupVotes.ts        ← (may already exist in features/groups — reuse)
  components/MovieSearchInput.tsx
  components/SearchResultItem.tsx
  components/MovieConfirmCard.tsx
  components/MovieDetailCard.tsx
  components/UserReviewCard.tsx
  pages/AddMoviePage.tsx
  pages/MovieDetailPage.tsx
  index.ts
```

---

## Component Specs

### MovieSearchInput
```tsx
// Controlled input with internal debounce
// onChange fires debounced query; minimum 2 chars before triggering
// Shows clear (×) button when has value
// Tactile TextField from @watch-it/ui with search icon adornment
```

### SearchResultItem
```tsx
// Pressable row: 40×56 poster | title (body1 bold) + year (body2)
// Poster: <Box component="img"> with fallback icon if no URL
// bgcolor: background.paper, borderRadius: '0.75rem'
// onPress: pass selected MovieSummary to confirmation screen via navigate state
```

### MovieConfirmCard
```tsx
// Centered layout: large poster (120×180) + title + year + date field
// Date field: simple <input type="date"> wrapped in TextField from @watch-it/ui
// Primary: "Adicionar ao grupo" (submit, loading state while mutation runs)
```

### UserReviewCard
```tsx
// Row: avatar circle (emoji or initials, 40×40) | name (body1) | RatingStars (sm)
// Comment below if present (body2, italic, text.secondary)
// No action — display only
```

---

## Debounce Hook Pattern

```ts
// apps/web/src/features/movies/hooks/useMovieSearch.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeSearchMoviesUseCase } from '@watch-it/application';
import { httpMovieRepository } from '@watch-it/infrastructure';

const searchUseCase = makeSearchMoviesUseCase(httpMovieRepository);

export function useMovieSearch(rawQuery: string) {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(rawQuery), 300);
    return () => clearTimeout(t);
  }, [rawQuery]);

  return useQuery({
    queryKey: ['movies-search', debouncedQuery],
    queryFn: () => searchUseCase(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });
}
```

---

## States

```tsx
// AddMoviePage
if (query.length < 2) return <Prompt message="Digite o nome do filme" />;
if (isLoading)        return <SkeletonList count={5} />;
if (isError)          return <ErrorState message="Erro ao buscar filmes." />;
if (!data?.length)    return <EmptyState message="Nenhum filme encontrado." />;
return <SearchResultList />;
```

---

## Design Tokens

| Element | Token |
|---|---|
| Poster placeholder bg | `background.paper` |
| Poster border | `divider` |
| Star fill | `tertiaryContainer` |
| Star empty | `divider` |
| Review card bg | `background.paper` |
| Comment text | `text.secondary` |
