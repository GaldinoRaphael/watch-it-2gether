---
description: "Use when writing or reviewing React components (.tsx files) in Watch It Together. Enforces MUI wrapping rules, styling constraints, single responsibility, accessibility, and forbidden patterns."
applyTo: "frontend/**/*.tsx"
---

# Component Rules

## Imports
- Feature code MUST import components from `@watch-it/ui`, never from `@mui/material` directly
- Only `packages/ui/**` may import from `@mui/material`
- Features communicate through `packages/` — never cross-import between feature folders

## Styling
```tsx
// ✅ Always
sx={{ p: 2, mt: 1 }}                                    // theme.spacing
sx={{ color: 'text.primary' }}                          // theme palette key
sx={{ bgcolor: 'background.paper' }}
sx={{ borderRadius: (t) => t.shape.borderRadius }}
sx={{ transition: 'all 200ms' }}                        // 150ms–250ms range

// ❌ Never
style={{ padding: '16px' }}                             // inline styles
sx={{ color: '#6200EE' }}                               // hardcoded hex
sx={{ padding: '16px', borderRadius: '8px' }}           // raw pixel values
```

## Props
- Use aggregated domain entities: `<MovieCard movie={movie} />` not 10 individual props
- Props must use domain entities (from `@watch-it/domain`), never raw DTOs
- Prefer `onPress` over `onClick` for React Native migration readiness

## Forbidden in JSX
- Business validation logic (belongs to Domain or Use Case)
- Direct API/Axios calls
- `process.env` access — use Environment Service
- State that represents server data — use TanStack Query hook instead

## Async page components must handle all four states
```tsx
if (isLoading) return <SkeletonList />;
if (isError) return <ErrorState message="Friendly message here." />;
if (!data?.length) return <EmptyState />;
return <DataView data={data} />;
```

## Single Responsibility
Split a component when it:
- Fetches data AND renders a complex UI
- Exceeds ~80 lines of meaningful JSX
- Handles more than one user flow
