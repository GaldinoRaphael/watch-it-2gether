---
name: feature-groups
description: "Build the Groups feature for Watch It Together. Covers: Groups list page (Meus Grupos), Create Group flow, and Group detail page (Home do Grupo). Includes UX spec, architecture chain, API endpoints, component specs, and states."
argument-hint: "groups-list | create-group | group-detail"
---

# Feature: Groups

Covers three screens: **Meus Grupos** (home), **Criar Grupo** (dialog), and **Home do Grupo** (group detail).

---

## UX/UI Spec

### Screen 1 — Meus Grupos (Groups List)

The user's home screen. Shows all groups they belong to.

**Layout:**
- Full-page list of `GroupCard` components — large tactile cards
- Each card: group avatar emoji (colored circle), group name (h4), movie count ("127 filmes", body2)
- Top-right or FAB: "Criar Grupo" button

**Empty state:**
```
🎬  (large, muted icon)
Você ainda não possui grupos.
Crie um grupo e comece a registrar
os filmes que vocês assistem juntos.

[ Criar Grupo ]   ← primary Button
```

**Loading state:** 2–3 skeleton cards (MUI Skeleton, same height as GroupCard)

**Error state:** "Não conseguimos carregar seus grupos."

---

### Screen 2 — Criar Grupo

Simple focused flow — render as a centered Dialog or bottom sheet, not a full page.

**Fields:**
- Nome do grupo (TextField, required, min 2 / max 40 chars)
- Avatar selector: 5 emoji options (row of tappable tiles)

**Avatar options (stored as string keys):**
| Key | Emoji | Label |
|---|---|---|
| `cinema` | 🎬 | Cinema |
| `popcorn` | 🍿 | Pipoca |
| `classic` | 🎞️ | Clássico |
| `camera` | 🎥 | Câmera |
| `star` | ⭐ | Favoritos |

No image upload — avatar is an emoji string only.

**Zod schema** (`createGroupSchema.ts`):
```ts
z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(40, 'Máximo 40 caracteres'),
  avatar: z.string().min(1, 'Escolha um avatar'),
})
```

**Buttons:**
- Primary: "Criar Grupo" (submit)
- Ghost: "Cancelar" (closes dialog)

**On success:** close dialog + refetch groups list + show success Snackbar

> **Avatar storage:** The backend `POST /groups` body only accepts `{ name, ownerId }`. Store the avatar emoji as `localStorage.setItem('group_avatar_<id>', avatarKey)` after the group is created. Read it back when rendering GroupCard.

---

### Screen 3 — Home do Grupo (Group Detail)

The product's main screen.

**Header:**
- Group avatar emoji + group name (h3)
- "N filmes assistidos" (body2, text.secondary)
- Share/invite icon button (top-right) — generates invite link via the group-invite endpoint (check `/api-docs`)

**Movie list:**
- `MovieListItem` cards sorted by rating descending (backend returns pre-sorted from `GET /groups/:groupId/votes`)
- Empty state: "Nenhum filme adicionado ainda."

**Bottom action area (fixed or sticky):**
- Primary: "＋ Adicionar Filme" → navigate to `/groups/:groupId/add-movie`
- Secondary: "Avaliações Pendentes (N)" — show only when `pendingCount > 0`

**Pending votes Snackbar:**
Show on mount when `pendingCount > 0`:
```
"Você possui N filmes para avaliar"
```
Pending = movies in the group that the current user has not yet voted on.

---

## Architecture Chain

```
Page → Hook → UseCase → Repository → HTTP Client → Backend
```

### ⚠️ Auth Interceptor — required before any 🔒 endpoint

Add this to `packages/infrastructure/src/http/httpClient.ts` **before building any protected hook**:

```ts
httpClient.interceptors.request.use((config) => {
  config.baseURL = environmentService.apiBaseUrl;
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

### API Endpoints

| Action | Method | Path | Auth |
|---|---|---|---|
| List my groups | `GET` | `/groups` | No |
| Get group by ID | `GET` | `/groups/:id` | No |
| Create group | `POST` | `/groups` | 🔒 |
| Get group members | `GET` | `/groups/:groupId/members` | 🔒 |
| Join group (invite link) | `POST` | `/groups/:groupId/members` | 🔒 |
| Get group votes (for movie list + pending) | `GET` | `/groups/:groupId/votes` | 🔒 |

> For the invite link feature, check `GET /api-docs` — a `group-invite` use case exists in the backend but may not be in `API.md`.

---

### Backend response schemas

```ts
// Group
{ id: string; name: string; ownerId: string; createdAt: string }

// GroupMember
{ id: string; groupId: string; userId: string; joinedAt: string }
```

---

### Files to create

```
packages/domain/src/repositories/GroupRepository.ts
packages/application/src/dto/GroupDTO.ts
packages/application/src/mappers/GroupMapper.ts
packages/application/src/useCases/listGroupsUseCase.ts
packages/application/src/useCases/getGroupUseCase.ts
packages/application/src/useCases/createGroupUseCase.ts
packages/infrastructure/src/repositories/httpGroupRepository.ts

apps/web/src/features/groups/
  schemas/createGroupSchema.ts
  hooks/useGroups.ts           ← useQuery(['groups'])
  hooks/useGroup.ts            ← useQuery(['group', id])
  hooks/useCreateGroup.ts      ← useMutation
  hooks/useGroupVotes.ts       ← useQuery(['group-votes', groupId])
  components/GroupCard.tsx
  components/GroupAvatarSelector.tsx
  components/CreateGroupForm.tsx
  components/MovieListItem.tsx
  pages/GroupsPage.tsx
  pages/GroupDetailPage.tsx
  index.ts
```

Update exports in:
- `packages/domain/src/index.ts` — add `GroupRepository`
- `packages/application/src/index.ts` — add DTO, Mapper, UseCases
- `packages/infrastructure/src/index.ts` — add `httpGroupRepository`

---

## Component Specs

### GroupCard
```tsx
// Tactile card — large, pressable
sx={{
  display: 'flex', alignItems: 'center', gap: 2, p: 3,
  borderRadius: '1rem', border: '2px solid', borderColor: 'divider',
  borderBottomWidth: '4px', cursor: 'pointer',
  transition: 'transform 150ms ease, border-bottom-width 150ms ease',
  '&:active': { transform: 'translateY(2px)', borderBottomWidth: '2px' },
}}
// Left: 56×56 circle with emoji, bgcolor: primaryContainer
// Right: name (h4) + "N filmes" (body2, text.secondary)
onPress: () => navigate(`/groups/${group.id}`)
```

### GroupAvatarSelector
```tsx
// Row of 5 pressable emoji tiles
// Each: 56×56, borderRadius: '0.75rem', border: '2px solid'
// Selected: bgcolor: primaryContainer, borderColor: onPrimaryContainer, borderBottomWidth: '4px'
// Unselected: bgcolor: background.paper, borderColor: divider
// Emoji centered, fontSize: '1.75rem'
```

### MovieListItem (inside group detail)
```tsx
// Compact row: poster (48×68 rounded) | title + year | avg rating
// Poster: fallback to movie icon if no posterUrl
// Rating: RatingStars component (sm size)
// onPress: navigate to /groups/:groupId/movie/:movieId
```

---

## Pending Votes Computation

```ts
// In useGroupVotes hook or GroupDetailPage
const currentUserId = useAuth().user?.id;
const userVotedMovieIds = new Set(
  votes.filter(v => v.userId === currentUserId).map(v => v.movieId)
);
const allMovieIds = new Set(votes.map(v => v.movieId));
const pendingCount = [...allMovieIds].filter(id => !userVotedMovieIds.has(id)).length;
```

---

## States

```tsx
// Every async page must cover all four:
if (isLoading) return <SkeletonList count={3} />;
if (isError)   return <ErrorState message="Não conseguimos carregar seus grupos." />;
if (!data?.length) return <EmptyState ... />;
return <DataView />;
```

---

## Design Tokens

| Element | Token |
|---|---|
| Card background | `background.paper` |
| Avatar circle bg | `primaryContainer` |
| Avatar emoji color | `onPrimaryContainer` |
| Movie avg rating | `tertiaryContainer` (star fill) |
| Pending badge | `error.main` |
| Empty icon | `text.disabled` |
| Section heading | `text.primary` |
