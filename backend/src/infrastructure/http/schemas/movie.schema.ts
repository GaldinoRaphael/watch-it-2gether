import { z } from "zod";

export const createMovieSchema = z.object({
  externalId: z.string().min(1),
  title: z.string().min(1),
  year: z.string().min(4).max(4),
  posterUrl: z.string().url().optional(),
});

export const updateMovieSchema = z.object({
  externalId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  year: z.string().min(4).max(4).optional(),
  posterUrl: z.string().url().optional(),
});
