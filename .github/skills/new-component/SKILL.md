---
name: new-component
description: "Create a new UI component for Watch It Together. Use when adding a reusable component (Button, Card, Input, Modal, etc.) or a feature-specific component (MovieCard, GroupCard, RatingStars). Enforces MUI wrapping in packages/ui, dark theme, spacing rules, and React Native-compatible API shape."
argument-hint: "<ComponentName> [base|composite|feature] e.g. MovieCard composite"
---

# New Component

Create a correctly structured, architecture-compliant React component.

## When to Use
- Adding a reusable UI primitive (wraps MUI inside `packages/ui`)
- Adding a composite component (MovieCard, GroupCard, RatingStars)
- Adding a feature-specific presentational component
- Reviewing an existing component for architecture violations

## Component Categories

| Category | Location | Purpose |
|----------|----------|---------|
| **Base** | `packages/ui/` | Wraps MUI — project-wide primitives |
| **Composite** | `packages/ui/` or `features/<name>/components/` | Combines base components |
| **Feature** | `features/<name>/components/` | Scoped to one feature |
| **Layout** | `apps/web/src/layouts/` | Header, Sidebar, page wrappers |

## Procedure

### 1. Choose the Right Category
- Does it use MUI directly? → **Base**, lives in `packages/ui/`
- Does it combine other components with no business logic? → **Composite**
- Is it specific to one product feature? → **Feature** component

### 2. Create a Base Component (MUI Wrapper)

File: `packages/ui/src/<ComponentName>.tsx`

```tsx
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

// Expose only the props the project needs — keep API React Native-compatible
export interface ButtonProps {
  label: string;
  onPress: () => void;   // use onPress, not onClick, for RN compatibility
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled, loading }: ButtonProps) {
  const muiVariant: MuiButtonProps['variant'] =
    variant === 'primary' ? 'contained' :
    variant === 'secondary' ? 'outlined' : 'text';

  return (
    <MuiButton
      variant={muiVariant}
      onClick={onPress}
      disabled={disabled || loading}
    >
      {loading ? <CircularProgress size={16} /> : label}
    </MuiButton>
  );
}
```

**Export from package index:**
```ts
// packages/ui/src/index.ts
export { Button } from './Button';
```

---

### 3. Create a Composite Component

File: `packages/ui/src/<Name>Card.tsx` or `features/<name>/components/<Name>Card.tsx`

```tsx
import { Box, Typography } from '@mui/material'; // OK only in packages/ui
import type { Movie } from '@watch-it/domain';

interface MovieCardProps {
  movie: Movie; // always use domain entity, never DTO
  onPress: (id: string) => void;
}

export function MovieCard({ movie, onPress }: MovieCardProps) {
  return (
    <Box
      onClick={() => onPress(movie.id)}
      sx={{
        borderRadius: (theme) => theme.shape.borderRadius,
        p: 2,           // theme.spacing(2) = 16px
        cursor: 'pointer',
        transition: 'opacity 200ms',
        '&:hover': { opacity: 0.85 },
      }}
    >
      <Typography variant="h6">{movie.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {movie.year}
      </Typography>
    </Box>
  );
}
```

---

### 4. Create a Feature Component

File: `apps/web/src/features/<name>/components/<Name>.tsx`

```tsx
import { Box } from '@mui/material'; // allowed only inside packages/ui
// Feature components import from packages/ui
import { Button, Card } from '@watch-it/ui';
import type { Movie } from '@watch-it/domain';

interface Props {
  movie: Movie;
}

export function MovieSearchResult({ movie }: Props) {
  return (
    <Card>
      {/* render using domain entity fields */}
    </Card>
  );
}
```

---

## Styling Rules (enforce these)

```tsx
// ✅ Correct
sx={{ p: 2, mt: 1, bgcolor: 'background.paper' }}
sx={{ color: 'text.primary' }}
sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
sx={{ transition: 'opacity 200ms' }}

// ❌ Wrong
style={{ padding: 16 }}
sx={{ color: '#6200EE' }}
sx={{ borderRadius: '8px' }}
sx={{ padding: '16px' }}
```

## Accessibility Rules
- Minimum touch/click target: 44px height
- Interactive elements must have `aria-label` when icon-only
- Use MUI semantic elements (`Button`, not `Box onClick`)
- Keyboard navigation must work

## Single Responsibility Rules
Each component must do **one thing**. Decompose when a component:
- Handles its own data fetching AND renders
- Has more than ~80 lines of JSX
- Contains business logic mixed with render logic

```tsx
// ✅ Good decomposition
<MovieCard movie={movie} />        // just renders
<MovieActions movieId={movie.id} /> // handles actions

// ❌ Bad — one component doing everything
<MovieCard movie={movie} onDelete={...} onVote={...} onSearch={...} />
```

## Props Design
Prefer aggregated domain entities over many individual props:

```tsx
// ✅
<MovieCard movie={movie} />

// ❌
<MovieCard title={...} year={...} poster={...} director={...} rating={...} />
```

## Checklist
- [ ] Base components live in `packages/ui/`, not in features
- [ ] Feature code only imports from `@watch-it/ui`, never `@mui/material`
- [ ] Props use domain entities, not DTOs
- [ ] No business logic inside JSX
- [ ] No hardcoded colors, pixels, or border-radius values
- [ ] Component handles only one responsibility
- [ ] Accessible: labels, focus states, touch targets

## Reference Files
- [Architecture Guide](../../frontend/docs/ARCHTETURE.md)
