import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { makeLoginUseCase } from '@watch-it/application';
import { httpAuthRepository } from '@watch-it/infrastructure';
import { useAuth } from '../../../providers/AuthContext';
import type { LoginFormData } from '../schemas/loginSchema';

const loginUseCase = makeLoginUseCase(httpAuthRepository);

export function useLogin() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: LoginFormData) => loginUseCase(email, password),
    onSuccess({ token, user }) {
      setAuth(token, user);
      navigate('/groups');
    },
  });
}
