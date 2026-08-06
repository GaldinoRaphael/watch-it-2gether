import { useQueries } from '@tanstack/react-query';
import { makeGetUserByIdUseCase } from '@watch-it/application';
import { httpUserRepository } from '@watch-it/infrastructure';

const getUserById = makeGetUserByIdUseCase(httpUserRepository);

export function useUserProfiles(userIds: string[]) {
  const queries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => getUserById(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  return Object.fromEntries(
    userIds.map((id, i) => [id, queries[i]?.data?.name ?? null]),
  ) as Record<string, string | null>;
}
