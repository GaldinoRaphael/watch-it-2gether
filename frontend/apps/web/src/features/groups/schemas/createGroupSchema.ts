import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(40, 'Máximo 40 caracteres'),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
