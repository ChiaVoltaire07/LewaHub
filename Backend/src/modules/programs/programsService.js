import { schoolsRepository } from "../schools/schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";
import { cacheDelPattern } from "../../config/redis.js";

const SCHOOL_DETAIL_CACHE_PREFIX = "schools:detail:";
const SCHOOLS_LIST_CACHE_PREFIX = "schools:list:";
const SCHOOL_NEARBY_CACHE_PREFIX = "schools:nearby:";

async function invalidateSchoolCaches(schoolId) {
  await cacheDelPattern(`${SCHOOL_DETAIL_CACHE_PREFIX}${schoolId}`);
  await cacheDelPattern(`${SCHOOLS_LIST_CACHE_PREFIX}*`);
  await cacheDelPattern(`${SCHOOL_NEARBY_CACHE_PREFIX}*`);
}

export const programsService = {
  async getPrograms(schoolId) {
    const school = await schoolsRepository.findById(schoolId);
    if (!school) {
      throw new AppError("School not found", 404);
    }
    return school.programs;
  },

  async addProgram(schoolId, programData) {
    const school = await schoolsRepository.findById(schoolId);
    if (!school) {
      throw new AppError("School not found", 404);
    }

    if (!programData.name || !programData.level) {
      throw new AppError("Program name and level required", 400);
    }

    const newProgram = {
      id: `prog-${Date.now()}`,
      ...programData,
    };

    school.programs = school.programs || [];
    school.programs.push(newProgram);

    await schoolsRepository.update(schoolId, { programs: school.programs });
    await invalidateSchoolCaches(schoolId);
    return newProgram;
  },

  async updateProgram(schoolId, programId, programData) {
    const school = await schoolsRepository.findById(schoolId);
    if (!school) {
      throw new AppError("School not found", 404);
    }

    const programIdx = school.programs.findIndex((p) => p.id === programId);
    if (programIdx === -1) {
      throw new AppError("Program not found", 404);
    }

    school.programs[programIdx] = { ...school.programs[programIdx], ...programData, id: programId };
    await schoolsRepository.update(schoolId, { programs: school.programs });
    await invalidateSchoolCaches(schoolId);
    return school.programs[programIdx];
  },

  async deleteProgram(schoolId, programId) {
    const school = await schoolsRepository.findById(schoolId);
    if (!school) {
      throw new AppError("School not found", 404);
    }

    const programIdx = school.programs.findIndex((p) => p.id === programId);
    if (programIdx === -1) {
      throw new AppError("Program not found", 404);
    }

    school.programs.splice(programIdx, 1);
    await schoolsRepository.update(schoolId, { programs: school.programs });
    await invalidateSchoolCaches(schoolId);
    return { success: true };
  },
};