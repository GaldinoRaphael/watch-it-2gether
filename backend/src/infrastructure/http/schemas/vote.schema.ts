import { z } from "zod";

export const createVoteSchema = z.object({
  userId: z.string().uuid(),
  groupId: z.string().uuid(),
  movieId: z.string().uuid(),
  rating: z.number().min(0).max(10),
  commentary: z.string().optional(),
});

export const updateVoteSchema = z.object({
  userId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
  movieId: z.string().uuid().optional(),
  rating: z.number().min(0).max(10).optional(),
  commentary: z.string().optional(),
});

export const voteMovieSchema = z.object({
  userId: z.string().uuid(),
  groupId: z.string().uuid(),
  externalId: z.string().min(1),
  rating: z.number().min(0).max(10),
  commentary: z.string().optional().default(""),
});
