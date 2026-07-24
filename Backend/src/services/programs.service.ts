import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { CreateProgramInput, UpdateProgramInput } from '../validators/program.schema';

export async function listProgramsForInstitution(institutionId: string) {
  await ensureInstitutionExists(institutionId);
  return prisma.program.findMany({ where: { institutionId }, orderBy: { name: 'asc' } });
}

export async function createProgram(institutionId: string, data: CreateProgramInput) {
  await ensureInstitutionExists(institutionId);
  return prisma.program.create({ data: { ...data, institutionId } });
}

export async function updateProgram(
  institutionId: string,
  programId: string,
  data: UpdateProgramInput,
) {
  await ensureProgramBelongsToInstitution(institutionId, programId);
  return prisma.program.update({ where: { id: programId }, data });
}

export async function deleteProgram(institutionId: string, programId: string) {
  await ensureProgramBelongsToInstitution(institutionId, programId);
  await prisma.program.delete({ where: { id: programId } });
}

async function ensureInstitutionExists(institutionId: string) {
  const exists = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { id: true },
  });
  if (!exists) {
    throw new NotFoundError('Institution not found');
  }
}

// Prevents editing/deleting a program through the wrong institution's URL (IDOR check)
async function ensureProgramBelongsToInstitution(institutionId: string, programId: string) {
  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { institutionId: true },
  });
  if (!program || program.institutionId !== institutionId) {
    throw new NotFoundError('Program not found for this institution');
  }
}
