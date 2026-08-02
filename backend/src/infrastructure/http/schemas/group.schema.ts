import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1),
  ownerId: z.string().uuid(),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).optional(),
  ownerId: z.string().uuid().optional(),
});
