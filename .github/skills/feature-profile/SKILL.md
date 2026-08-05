---
name: feature-profile
description: "Build the Profile feature for Watch It Together. Covers: Profile page (avatar, name, email, stats), edit name, edit avatar, and logout. Includes emoji avatar storage pattern and GET /user/me integration."
argument-hint: "profile"
---

# Feature: Profile

Covers one screen: **Perfil** — user identity, stats, editable fields, and logout.

---

## UX/UI Spec

### Screen — Perfil

**Layout (top to bottom):**
1. Avatar display — large emoji circle (80×80), tap to change
2. Name (h3, centered) — tap/edit icon to enter edit mode
3. Email (body2, text.secondary, centered) — read-only
4. "Membro desde" date (body2, text.secondary)
5. Stat card: "N avaliações realizadas"
6. Divider
7. Edit name button (if not inline edit)
8. "Sair" button (logout, secondary variant, destructive color)

**Edit name flow:**
- Tap name or edit icon → inline TextField replaces name display
- Confirm with ✓ button or blur
- Calls update endpoint if available (check `GET /api-docs`)

**Avatar picker:**
- Tap avatar → opens Dialog or bottom sheet with `AvatarSelector`
- Same 5 emoji options as group avatar
- Saved to `localStorage.setItem('user_avatar', key)`
- Immediately reflects in the header/display

**Logout:**
- Calls `AuthContext.logout()`
- Navigates to `/login` with `replace: true`
- No confirmation dialog needed

---

## Avatar Options (shared with groups feature)

| Key | Emoji | Label |
|---|---|---|
| `cinema` | 🎬 | Cinema |
| `popcorn` | 🍿 | Pipoca |
| `classic` | 🎞️ | Clássico |
| `camera` | 🎥 | Câmera |
| `star` | ⭐ | Favoritos |

Default (no selection): first letter of name in a `primaryContainer` circle.

Storage: `localStorage.setItem('user_avatar', 'cinema')` — read in `useUserAvatar()` hook.

---

## Architecture Chain

```
Page → Hook → UseCase → Repository → HTTP Client → Backend
```

### API Endpoints

| Action | Method | Path | Auth |
|---|---|---|---|
| Get current user | `GET` | `/user/me` | 🔒 |
| Update user name | `PUT` | `/user/me` | 🔒 | *(verify in `/api-docs` — may not exist in V0)* |

> If `PUT /user/me` does not exist, make name editing **localStorage-only** for V0 using `localStorage.setItem('user_name_override', name)`.

### Total ratings count
Derive from `GET /groups/:groupId/votes` across all groups, filtering by `userId === currentUser.id`.
Alternatively, fetch `GET /votes` and filter client-side if the endpoint allows it.

---

### Backend response schema

```ts
// GET /user/me
{ id: string; name: string; email: string; createdAt?: string }
```

---

### Files to create

```
packages/application/src/useCases/getProfileUseCase.ts
  (check if already exists — backend has UserProfileUseCase)

packages/infrastructure/src/repositories/httpUserRepository.ts
  (or reuse existing auth infrastructure)

packages/ui/src/components/AvatarDisplay.tsx   ← shared avatar display
packages/ui/src/components/AvatarSelector.tsx  ← emoji picker dialog content

apps/web/src/features/profile/
  hooks/useProfile.ts          ← useQuery(['profile'])
  hooks/useUserAvatar.ts       ← reads/writes localStorage('user_avatar')
  components/ProfileHeader.tsx ← avatar + name + email
  components/StatCard.tsx      ← "N avaliações" (reuse tactile card pattern)
  components/EditNameField.tsx ← inline edit with confirm/cancel
  pages/ProfilePage.tsx
  index.ts
```

Update exports in:
- `packages/ui/src/index.ts` — add `AvatarDisplay`, `AvatarSelector`
- `apps/web/src/features/profile/index.ts`
- `apps/web/src/pages/ProfilePage.tsx` — replace stub

---

## Component Specs

### AvatarDisplay (packages/ui)
```tsx
interface AvatarDisplayProps {
  avatarKey?: string;        // 'cinema' | 'popcorn' | etc.
  name?: string;             // fallback: first letter
  size?: 'sm' | 'md' | 'lg'; // 32 / 56 / 80px
  onPress?: () => void;       // shows edit indicator if provided
}
// bgcolor: primaryContainer, color: onPrimaryContainer
// If avatarKey: show emoji; else: show name[0].toUpperCase()
// If onPress: small edit icon overlay (bottom-right)
```

### AvatarSelector (packages/ui)
```tsx
interface AvatarSelectorProps {
  value?: string;
  onChange: (key: string) => void;
}
// Row of 5 tiles — same design as GroupAvatarSelector in feature-groups
// Reusable: used by both CreateGroupForm and ProfilePage
// Consider extracting GroupAvatarSelector → AvatarSelector in packages/ui
```

### ProfileHeader
```tsx
// AvatarDisplay (lg, onPress opens avatar picker)
// Name — h3 or inline TextField when editing
// Email — body2, text.secondary
// "Membro desde: DD/MM/AAAA" — caption
```

### StatCard
```tsx
// Tactile card (reuse tactile pattern from design-system)
// Large number (h2, primaryContainer color) + label (body2)
// Example: "47" + "avaliações realizadas"
```

---

## useUserAvatar Hook

```ts
// features/profile/hooks/useUserAvatar.ts
const AVATAR_KEY = 'user_avatar';

export function useUserAvatar() {
  const [avatar, setAvatarState] = useState(() => localStorage.getItem(AVATAR_KEY) ?? '');

  const setAvatar = (key: string) => {
    localStorage.setItem(AVATAR_KEY, key);
    setAvatarState(key);
  };

  return { avatar, setAvatar };
}
```

---

## States

```tsx
// ProfilePage
if (isLoading) return <ProfileSkeleton />;
if (isError)   return <ErrorState message="Não conseguimos carregar seu perfil." />;
return <ProfileContent />;
```

---

## Design Tokens

| Element | Token |
|---|---|
| Avatar circle bg | `primaryContainer` |
| Avatar text/emoji | `onPrimaryContainer` |
| Name text | `text.primary` |
| Email / secondary info | `text.secondary` |
| Stat number | `primary.main` |
| Logout button | `error.main` (use `color="error"` on Button) |
| Card bg | `background.paper` |

---

## Logout Implementation

```tsx
// In ProfilePage or a LogoutButton component
const { logout } = useAuth();
const navigate = useNavigate();

function handleLogout() {
  logout();
  navigate('/login', { replace: true });
}
```
