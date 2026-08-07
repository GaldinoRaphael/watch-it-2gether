import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAddMovieToGroupUseCase } from '@watch-it/application';
import { httpMovieRepository } from '@watch-it/infrastructure';

const addMovieToGroup = makeAddMovieToGroupUseCase(httpMovieRepository);

export function useAddMovieToGroup(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMovieToGroup,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['group', groupId] }),
        queryClient.invalidateQueries({ queryKey: ['groups'] }),
        queryClient.invalidateQueries({ queryKey: ['watched-movies', groupId] }),
        queryClient.invalidateQueries({ queryKey: ['group-votes', groupId] }),
      ]);
    },
  });
}
