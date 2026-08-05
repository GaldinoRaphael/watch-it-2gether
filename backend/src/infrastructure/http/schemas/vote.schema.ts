import { z } from "zod";

export const createVoteSchema = z.object({
  userId: z.string().uuid(),
  groupId: z.string().uuid(),
  movieId: z.string().uuid(),
  rating: z.number().min(0).max(5),
  commentary: z.string().optional(),
});

export const updateVoteSchema = z.object({
  userId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
  movieId: z.string().uuid().optional(),
  rating: z.number().min(0).max(5).optional(),
  commentary: z.string().optional(),
});

export const voteMovieSchema = z.object({
  userId: z.string().uuid(),
  groupId: z.string().uuid(),
  externalId: z.coerce.string().min(1),
  movieTitle: z.string().optional(),
  posterUrl: z.string().optional(),
  provider: z.string().optional(),
  rating: z.number().min(0).max(5),
  commentary: z.string().optional().default(""),
});
