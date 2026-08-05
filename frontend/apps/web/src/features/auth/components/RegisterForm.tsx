import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, TextField, Alert } from '@watch-it/ui';
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema';
import { useRegister, getRegisterErrorMessage } from '../hooks/useRegister';

export function RegisterForm() {
  const { mutate: register, isPending, isError, error } = useRegister();
  const navigate = useNavigate();

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => register(data);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
    >
      {isError && (
        <Alert severity="error">{getRegisterErrorMessage(error)}</Alert>
      )}

      <TextField
        id="name"
        label="Nome"
        type="text"
        placeholder="Seu nome"
        register={field('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        id="email"
        label="Email"
        type="email"
        placeholder="nome@exemplo.com"
        register={field('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••••"
        register={field('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        id="confirmPassword"
        label="Confirmar Senha"
        type="password"
        placeholder="••••••••"
        register={field('confirmPassword')}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
        <Button label="Criar Conta" type="submit" variant="primary" fullWidth loading={isPending} />
        <Button
          label="Já tenho conta"
          variant="secondary"
          fullWidth
          onPress={() => navigate('/login')}
        />
      </Box>
    </Box>
  );
}
