---
name: feature-voting
description: "Build the Voting/Rating feature for Watch It Together. Covers: Rate a Movie screen and Pending Votes flow (card-by-card). Includes the RatingStars component spec, 0–10 backend mapping, and pending vote computation logic."
argument-hint: "rate-movie | pending-votes"
---

# Feature: Voting / Rating

Covers two screens: **Avaliação** (rate a single movie) and **Avaliações Pendentes** (batch card-by-card flow).

Also covers the reusable `RatingStars` component (lives in `packages/ui`).

---

## UX/UI Spec

### Screen 1 — Avaliação (Rate a Movie)

Focused single-action screen. Accessed from the confirmation step of "Adicionar Filme" or from the Pending Votes flow.

**Layout:**
- Poster (large, centered, 2:3 aspect ratio)
- Title (h3) + Year (body2, text.secondary)
- `RatingStars` component — lg size, interactive
  - Label: "Sua nota"
  - 0–5 stars, 0.5 step
- Optional comment field: TextField multiline, label "O que você achou do filme? (opcional)"
- Primary button: "Salvar avaliação"

**On save:**
- Call `POST /vote` (create) or `PUT /vote/:id` (update if vote already exists)
- Navigate back to group detail

---

### Screen 2 — Avaliações Pendentes (Pending Votes Flow)

Card-by-card rating experience. Accessed via "Avaliações Pendentes" button in group detail.

**Layout:**
- Progress bar at top: "2 de 5 avaliações"
- X button (top-right) → confirm exit dialog
- Center: movie card (poster + title + year)
- `RatingStars` lg + optional comment
- "Próximo" button (or "Finalizar" on last movie)

**Exit dialog:**
```
Tem certeza que deseja sair?
Suas avaliações salvas serão mantidas.
[ Continuar ] [ Sair ]
```

**On complete all:** navigate back to group detail + show success Snackbar

**Pending computation:**
```ts
// Movies the current user has not yet voted on in this group
const currentUserId = useAuth().user?.id;
const votedMovieIds = new Set(
  votes.filter(v => v.userId === currentUserId).map(v => v.movieId)
);
const allMovieIds = [...new Set(votes.map(v => v.movieId))];
const pendingMovieIds = allMovieIds.filter(id => !votedMovieIds.has(id));
```

---

## RatingStars Component (packages/ui)

This is a **reusable component** — lives in `packages/ui/src/components/RatingStars.tsx`, not in a feature folder.

### Props
```ts
interface RatingStarsProps {
  value: number;           // 0–5, supports 0.5 increments
  onChange?: (v: number) => void;  // undefined = read-only
  size?: 'sm' | 'lg';
  showLabel?: boolean;     // shows "4.5" text next to stars
}
```

### Spec
- **5 stars** rendered
- Each star supports **half-star** (left half = 0.5, right half = 1.0)
- `sm` size: 20px stars (used in MovieListItem, UserReviewCard)
- `lg` size: 40px stars (used in rating screen)
- Interactive mode (`onChange` provided): highlight on hover/drag, tap to set
- Read-only mode (`onChange` absent): static filled display

### Colors
```tsx
// Filled portion
sx={{ color: 'tertiaryContainer' }}
// Empty portion
sx={{ color: 'divider' }}
// Hover/active
sx={{ color: 'onTertiaryContainer' }}
```

### Implementation approach
Use MUI `Rating` component wrapped in `packages/ui`:
```tsx
import MuiRating from '@mui/material/Rating';

<MuiRating
  value={value}
  precision={0.5}
  readOnly={!onChange}
  onChange={(_, v) => onChange?.(v ?? 0)}
  size={size === 'lg' ? 'large' : 'small'}
  sx={{ color: 'tertiaryContainer', '& .MuiRating-iconEmpty': { color: 'divider' } }}
/>
```

---

## ⭐ Rating Mapping Rule

Backend stores **0–10**. UI shows **0–5** (0.5 step). Always apply in the Mapper:

```ts
// VoteMapper.ts
toDomain(dto: VoteDTO): Vote {
  return {
    ...dto,
    rating: dto.rating / 2,   // 9.0 → 4.5 for display
  };
}

// Before POST /vote
const payload = { ...data, rating: data.rating * 2 };  // 4.5 → 9.0
```

---

## Architecture Chain

```
Page → Hook → UseCase → Repository → HTTP Client → Backend
```

### API Endpoints

| Action | Method | Path | Auth |
|---|---|---|---|
| Submit or update vote | `POST` | `/vote` | 🔒 |
| Update existing vote | `PUT` | `/vote/:id` | 🔒 |
| Get group votes (for pending list) | `GET` | `/groups/:groupId/votes` | 🔒 |

### POST /vote body
```ts
{
  userId: string;       // from useAuth().user.id
  groupId: string;      // from route params
  externalId: string;   // IMDB id of the movie
  rating: number;       // 0–10 (multiply UI value × 2)
  commentary?: string;  // optional
}
```

> `POST /vote` creates or updates (upserts) based on `(userId, groupId, externalId)` — safe to call multiple times.

---

### Files to create

```
packages/application/src/useCases/submitVoteUseCase.ts
packages/infrastructure/src/repositories/httpVoteRepository.ts

packages/ui/src/components/RatingStars.tsx   ← shared, goes in packages/ui

apps/web/src/features/voting/
  schemas/voteSchema.ts         ← rating (number, min 0, max 5) + commentary (optional)
  hooks/useSubmitVote.ts        ← useMutation
  hooks/usePendingVotes.ts      ← derives pending list from group votes
  components/RateMovieCard.tsx  ← poster + title + RatingStars lg + comment field
  components/PendingProgress.tsx ← progress bar + "N de M" label
  pages/RateMoviePage.tsx
  pages/PendingVotesPage.tsx
  index.ts
```

Export `RatingStars` from `packages/ui/src/index.ts`.

---

## Zod Schema

```ts
// features/voting/schemas/voteSchema.ts
export const voteSchema = z.object({
  rating: z.number().min(0.5, 'Dê pelo menos 0.5 estrelas').max(5),
  commentary: z.string().max(500).optional(),
});

export type VoteFormData = z.infer<typeof voteSchema>;
```

---

## usePendingVotes Hook

```ts
// features/voting/hooks/usePendingVotes.ts
export function usePendingVotes(groupId: string) {
  const { user } = useAuth();
  const { data: votes = [] } = useGroupVotes(groupId);

  const votedMovieIds = new Set(
    votes.filter(v => v.userId === user?.id).map(v => v.movieId)
  );
  const allMovieIds = [...new Set(votes.map(v => v.movieId))];

  return allMovieIds
    .filter(id => !votedMovieIds.has(id))
    .map(id => votes.find(v => v.movieId === id)!);  // any vote for that movie carries movie info
}
```

---

## States

```tsx
// PendingVotesPage
if (!pendingMovies.length) {
  navigate(`/groups/${groupId}`, { replace: true });
  return null;
}

// RateMoviePage
if (isSubmitting) return <LoadingOverlay />;
```

---

## Design Tokens

| Element | Token |
|---|---|
| Star fill | `tertiaryContainer` |
| Star hover | `onTertiaryContainer` |
| Star empty | `divider` |
| Progress bar fill | `primary.main` |
| Progress bar bg | `background.paper` |
| Exit dialog bg | `background.paper` |
