import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { makeRegisterUseCase } from '@watch-it/application';
import { httpAuthRepository } from '@watch-it/infrastructure';
import { useAuth } from '../../../providers/AuthContext';
import type { RegisterFormData } from '../schemas/registerSchema';

const registerUseCase = makeRegisterUseCase(httpAuthRepository);

export function useRegister() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: ({ name, email, password }: RegisterFormData) =>
      registerUseCase(name, email, password),
    onSuccess({ token, user }) {
      setAuth(token, user);
      const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;
      navigate(redirectTo ?? '/groups', { state: { registered: true } });
    },
    onError(error) {
      // error message mapping happens in the component via isAxiosError
      return error;
    },
  });
}

export function getRegisterErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.status === 409) {
    return 'Este e-mail já está em uso.';
  }
  return 'Erro ao criar conta. Tente novamente.';
}
