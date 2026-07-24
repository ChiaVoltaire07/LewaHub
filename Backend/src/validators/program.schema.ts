import { z } from 'zod';

export const createProgramSchema = z.object({
  name: z.string().min(2).max(200),
  degreeLevel: z.string().min(2).max(100),
  durationMonths: z.number().int().positive('durationMonths must be positive'),
  tuition: z.number().nonnegative('tuition cannot be negative'),
  currency: z.string().length(3).default('XAF'),
});

export const updateProgramSchema = createProgramSchema.partial();

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
