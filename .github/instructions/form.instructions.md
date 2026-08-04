---
description: "Use when building forms in Watch It Together. Covers React Hook Form + Zod integration, schema placement, validation rules, and submission patterns with TanStack Query mutations."
applyTo: "frontend/**/*Form*.tsx"
---

# Form Rules

## Required Libraries
All forms MUST use **React Hook Form** + **Zod**. No uncontrolled validation, no manual `useState` for field values.

## Schema Location
Zod schemas live in `features/<name>/schemas/<form-name>Schema.ts`, not inside component files.

```ts
// features/auth/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

## Form Component Pattern
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        label="Email"
      />
      <Button type="submit" label="Login" loading={isPending} />
    </Box>
  );
}
```

## Rules
- Form submission calls a `useMutation` hook — never calls use cases or repositories directly
- Validation messages are user-friendly strings (Portuguese by default)
- Business rules (e.g. "email must be unique") belong in the Domain layer, not in Zod schemas
- Zod schemas validate **shape and format** only — not business invariants
- Never disable the submit button without indicating why (accessibility)
- On submit error: show inline field errors or a toast — never `console.error` only

## Error Display
```tsx
// ✅ Show inline errors from Zod
helperText={errors.email?.message}

// ✅ Show server/mutation errors as a toast or alert
onError: (error) => showSnackbar('Unable to log in. Try again.')

// ❌ Never expose backend error messages to the user
helperText={apiError.response.data.message}
```
