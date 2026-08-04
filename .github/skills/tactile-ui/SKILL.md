---
name: tactile-ui
description: "Build UI components following the CineQuest Tactile design system. Use when creating buttons, cards, bento layouts, progress bars, movie cards, or any interactive component. Enforces 3D pressed effects, correct color token usage, Plus Jakarta Sans / Be Vietnam Pro typography, and dark-mode-ready patterns."
argument-hint: "<ComponentName> e.g. MovieCard, BentoStats, ProgressBar"
---

# CineQuest Tactile UI

Build components that feel physical, gamified, and dark-mode-ready.

## When to Use
- Creating any interactive or visual component
- Reviewing a component for design system compliance
- Adding a new bento card, movie card, or stat widget

---

## Core Rules

### Colors — always from theme, never hardcoded
```tsx
// ✅
sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
sx={{ bgcolor: 'tertiaryContainer', color: 'onTertiaryContainer' }}

// ❌
sx={{ bgcolor: '#f9f9f9', color: '#1a1c1c' }}
```

Available custom palette keys (in addition to MUI defaults):
- `primaryContainer`, `onPrimaryContainer`
- `secondaryContainer`, `onSecondaryContainer`
- `tertiaryContainer`, `onTertiaryContainer`

### Typography — use MUI variants
```tsx
<Typography variant="h1">      // Plus Jakarta Sans 800 — display
<Typography variant="h4">      // Plus Jakarta Sans 700 — section title
<Typography variant="body1">   // Be Vietnam Pro 500 17px — main text
<Typography variant="body2">   // Be Vietnam Pro 500 15px — secondary text
<Typography variant="button">  // Plus Jakarta Sans 800 UPPERCASE — labels
<Typography variant="caption"> // Plus Jakarta Sans 800 10px UPPERCASE — micro labels
```

### Spacing — always `theme.spacing(n)`, never raw pixels
```tsx
sx={{ p: 2 }}     // 16px
sx={{ p: 3 }}     // 24px
sx={{ p: 4 }}     // 32px
sx={{ gap: 2 }}   // 16px gutter between cards
```

### Border Radius
| Use case | Value | sx equivalent |
|----------|-------|---------------|
| Buttons, chips | `0.75rem` | `borderRadius: '0.75rem'` |
| Cards | `1rem` | default from theme |
| Bento containers | `1.5rem` | via `bentoCard` mixin |
| Avatars/circles | `9999px` | `borderRadius: '9999px'` |

---

## 3D Tactile Effect

### Using the mixin (recommended)
```tsx
import { tactileCard } from '@watch-it/design-system';

<Box sx={{ ...tactileCard, bgcolor: 'background.paper' }}>
  ...
</Box>
```

### Manual 3D border
```tsx
sx={{
  border: '2px solid',
  borderColor: 'divider',
  borderBottomWidth: '4px',
  borderRadius: '1rem',
  transition: 'transform 150ms ease, border-bottom-width 150ms ease',
  '&:active': {
    transform: 'translateY(2px)',
    borderBottomWidth: '2px !important',
  },
}}
```

### 3D border color rule
The bottom border should be a **darker version** of the component background color:
- Green card (`primaryContainer`) → border `onPrimaryContainer`
- Blue card (`secondaryContainer`) → border `onSecondaryContainer`
- Yellow card (`tertiaryContainer`) → border `onTertiaryContainer`
- White/paper card → border `divider` (outlineVariant)

---

## Component Recipes

### Standard Card
```tsx
import { tactileCard } from '@watch-it/design-system';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function StatCard({ label, value }: Props) {
  return (
    <Box sx={{ ...tactileCard, bgcolor: 'background.paper', p: 3 }}>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="h3">{value}</Typography>
    </Box>
  );
}
```

### Bento Card (dashboard feature card)
```tsx
import { bentoCard, shineOverlay } from '@watch-it/design-system';

export function BentoFeatureCard({ children }: Props) {
  return (
    <Box
      sx={{
        ...bentoCard,
        ...shineOverlay,
        bgcolor: 'secondaryContainer',
        borderColor: 'onSecondaryContainer',
        color: 'onSecondaryContainer',
      }}
    >
      {/* large icon at low opacity in background corner */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -8,
          right: -8,
          opacity: 0.12,
          fontSize: '6rem',
        }}
      >
        🎬
      </Box>
      {children}
    </Box>
  );
}
```

### Movie Card (2:3 poster with reaction bubble)
```tsx
import { tactileCard } from '@watch-it/design-system';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Movie } from '@watch-it/domain';

interface MovieCardProps {
  movie: Movie;
  onPress: (id: string) => void;
}

export function MovieCard({ movie, onPress }: MovieCardProps) {
  return (
    <Box
      onClick={() => onPress(movie.id)}
      sx={{
        ...tactileCard,
        width: 160,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* Poster — 2:3 aspect ratio */}
      <Box sx={{ position: 'relative', aspectRatio: '2/3' }}>
        <Box
          component="img"
          src={movie.poster}
          alt={movie.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Reaction bubble */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: '9999px',
            border: '2px solid',
            borderColor: 'background.paper',
            bgcolor: 'primaryContainer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
            ⭐
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography variant="h6" noWrap>{movie.title}</Typography>
        <Typography variant="body2" color="text.secondary">{movie.year}</Typography>
      </Box>
    </Box>
  );
}
```

### Gamified Progress Bar
```tsx
import { progressShine } from '@watch-it/design-system';
import Box from '@mui/material/Box';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
}

export function GamifiedProgressBar({ value, color = 'primary.main' }: ProgressBarProps) {
  return (
    <Box
      sx={{
        border: '2px solid',
        borderColor: 'divider',
        borderRadius: '9999px',
        height: 20,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          ...progressShine,
          height: '100%',
          width: `${value}%`,
          bgcolor: color,
          borderRadius: '9999px',
          position: 'relative',
          transition: 'width 300ms ease',
        }}
      />
    </Box>
  );
}
```

---

## Dark Mode

The app supports dark mode via `useThemeMode()`:

```tsx
import { useThemeMode } from '../providers/ThemeProvider';

export function ThemeToggle() {
  const { mode, toggleColorMode } = useThemeMode();
  return (
    <IconButton onPress={toggleColorMode} aria-label="toggle theme">
      {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
```

All components using `theme.palette.*` tokens are dark-mode-ready automatically — no changes needed when dark mode is activated.

---

## Checklist
- [ ] No hardcoded hex colors in `sx` or `styled()`
- [ ] No hardcoded pixel values — use `theme.spacing(n)` or rem
- [ ] Interactive cards/buttons have the 3D border + press effect
- [ ] Typography uses `variant` prop, not manual `fontSize`
- [ ] Bottom border color = darker version of the component background
- [ ] Component is `position: relative` if using `shineOverlay` or `bentoCard`
