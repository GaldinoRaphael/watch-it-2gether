import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeListGroupsUseCase, makeCreateGroupUseCase } from '@watch-it/application';
import { httpGroupRepository } from '@watch-it/infrastructure';

const listGroups = makeListGroupsUseCase(httpGroupRepository);
const createGroup = makeCreateGroupUseCase(httpGroupRepository);

export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: listGroups,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, ownerId }: { name: string; ownerId: string }) =>
      createGroup(name, ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
