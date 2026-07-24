import { z } from 'zod';

export const createInstitutionSchema = z.object({
  name: z.string().min(2).max(200),
  region: z.string().min(2).max(100),
  type: z.string().min(2).max(100),
  description: z.string().max(2000).optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const updateInstitutionSchema = createInstitutionSchema.partial();

export const listInstitutionsQuerySchema = z.object({
  region: z.string().optional(),
  type: z.string().optional(),
  keyword: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateInstitutionInput = z.infer<typeof createInstitutionSchema>;
export type UpdateInstitutionInput = z.infer<typeof updateInstitutionSchema>;
export type ListInstitutionsQuery = z.infer<typeof listInstitutionsQuerySchema>;
