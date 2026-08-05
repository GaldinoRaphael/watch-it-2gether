import { useQuery } from '@tanstack/react-query';
import { makeGetGroupUseCase } from '@watch-it/application';
import { httpGroupRepository } from '@watch-it/infrastructure';

const getGroup = makeGetGroupUseCase(httpGroupRepository);

export function useGroup(groupId?: string) {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroup(groupId as string),
    enabled: Boolean(groupId),
  });
}
