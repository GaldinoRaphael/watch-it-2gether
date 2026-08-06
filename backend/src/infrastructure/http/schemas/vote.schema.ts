import { z } from "zod";

const ratingStepSchema = z
  .number()
  .min(0)
  .max(5)
  .refine((rating) => Number.isInteger(rating * 2), {
    message: "Rating must use 0.5 increments",
  });

export const createVoteSchema = z.object({
  userId: z.string().uuid(),
  groupId: z.string().uuid(),
  movieId: z.string().uuid(),
  rating: ratingStepSchema,
  commentary: z.string().optional(),
});

export const updateVoteSchema = z.object({
  userId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
  movieId: z.string().uuid().optional(),
  rating: ratingStepSchema.optional(),
  commentary: z.string().optional(),
});

export const voteMovieSchema = z.object({
  groupId: z.string().uuid(),
  externalId: z.coerce.string().min(1),
  movieTitle: z.string().optional(),
  posterUrl: z.string().optional(),
  provider: z.string().optional(),
  rating: ratingStepSchema,
  commentary: z.string().optional().default(""),
});
