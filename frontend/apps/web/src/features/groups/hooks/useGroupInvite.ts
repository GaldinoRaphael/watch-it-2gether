import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  makeAcceptGroupInviteUseCase,
  makeCreateGroupInviteUseCase,
  makeGetGroupInviteUseCase,
} from '@watch-it/application';
import { httpGroupInviteRepository } from '@watch-it/infrastructure';

const createInvite = makeCreateGroupInviteUseCase(httpGroupInviteRepository);
const getInvite = makeGetGroupInviteUseCase(httpGroupInviteRepository);
const acceptInvite = makeAcceptGroupInviteUseCase(httpGroupInviteRepository);

export function useCreateGroupInvite(groupId?: string) {
  return useMutation({
    mutationFn: () => createInvite(groupId as string),
  });
}

export function useGroupInvite(token?: string) {
  return useQuery({
    queryKey: ['group-invite', token],
    queryFn: () => getInvite(token as string),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useAcceptGroupInvite(token?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptInvite(token as string),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['group', result.groupId] });
    },
  });
}
