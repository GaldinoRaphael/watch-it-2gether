import { useQuery } from '@tanstack/react-query';
import { makeGetProfileUseCase, makeGetTotalRatingsUseCase } from '@watch-it/application';
import { httpUserRepository } from '@watch-it/infrastructure';
import { useAuth } from '../../../providers/AuthContext';

const getProfile = makeGetProfileUseCase(httpUserRepository);
const getTotalRatings = makeGetTotalRatingsUseCase(httpUserRepository);

export function useProfile() {
  const { user } = useAuth();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!user,
  });

  const ratingsQuery = useQuery({
    queryKey: ['profile', 'totalRatings', user?.id],
    queryFn: () => getTotalRatings(user!.id),
    enabled: !!user?.id,
  });

  return {
    profile: profileQuery.data,
    totalRatings: ratingsQuery.data ?? 0,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
  };
}
