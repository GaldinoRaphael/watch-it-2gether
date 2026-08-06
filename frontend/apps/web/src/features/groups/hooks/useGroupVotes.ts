import { useQuery } from '@tanstack/react-query';
import { makeGetGroupVotesUseCase } from '@watch-it/application';
import { httpVoteRepository } from '@watch-it/infrastructure';

const getGroupVotes = makeGetGroupVotesUseCase(httpVoteRepository);

export function useGroupVotes(groupId?: string) {
  return useQuery({
    queryKey: ['group-votes', groupId],
    queryFn: () => getGroupVotes(groupId as string),
    enabled: Boolean(groupId),
    staleTime: 30_000,
  });
}
