import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, TextField, Alert } from '@watch-it/ui';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const { mutate: login, isPending, isError } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
    >
      {isError && (
        <Alert severity="error">E-mail ou senha incorretos. Tente novamente.</Alert>
      )}

      <TextField
        id="email"
        label="Email"
        type="email"
        placeholder="nome@exemplo.com"
        register={register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        id="password"
        label="Senha"
        type="password"
        placeholder="••••••••"
        register={register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography
          variant="caption"
          sx={{ color: 'secondary.main', opacity: 0.6, cursor: 'default' }}
        >
          Esqueceu a senha?
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
        <Button label="Entrar" type="submit" variant="primary" fullWidth loading={isPending} />
        <Button
          label="Criar Conta"
          variant="secondary"
          fullWidth
          onPress={() => navigate('/register')}
        />
      </Box>
    </Box>
  );
}
