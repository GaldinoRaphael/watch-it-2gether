import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeAddMovieToGroupUseCase } from '@watch-it/application';
import { httpMovieRepository } from '@watch-it/infrastructure';

const submitVote = makeAddMovieToGroupUseCase(httpMovieRepository);

export function useSubmitVote(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitVote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-votes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['watched-movies', groupId] });
    },
  });
}
