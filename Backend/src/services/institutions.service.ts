import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import {
  CreateInstitutionInput,
  ListInstitutionsQuery,
  UpdateInstitutionInput,
} from '../validators/institution.schema';

export async function listInstitutions(query: ListInstitutionsQuery) {
  const { region, type, keyword, page, limit } = query;

  const where = {
    ...(region ? { region } : {}),
    ...(type ? { type } : {}),
    ...(keyword ? { name: { contains: keyword, mode: 'insensitive' as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.institution.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.institution.count({ where }),
  ]);

  return {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getInstitutionById(id: string) {
  const institution = await prisma.institution.findUnique({
    where: { id },
    include: { programs: true },
  });

  if (!institution) {
    throw new NotFoundError('Institution not found');
  }

  // Part 2 adds the Evaluation model — once it exists, replace this
  // placeholder with a real aggregate (average + count) query.
  return { ...institution, ratingSummary: { average: null as number | null, count: 0 } };
}

export async function createInstitution(data: CreateInstitutionInput) {
  return prisma.institution.create({ data });
}

export async function updateInstitution(id: string, data: UpdateInstitutionInput) {
  await ensureInstitutionExists(id);
  return prisma.institution.update({ where: { id }, data });
}

export async function deleteInstitution(id: string) {
  await ensureInstitutionExists(id);
  await prisma.institution.delete({ where: { id } });
}

export async function recordView(id: string) {
  await ensureInstitutionExists(id);
  await prisma.institution.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}

async function ensureInstitutionExists(id: string) {
  const exists = await prisma.institution.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    throw new NotFoundError('Institution not found');
  }
}
