import { institutionsRepository } from "../institutions/institutionsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export const programsService = {
  async getPrograms(institutionId) {
    const inst = await institutionsRepository.findById(institutionId);
    if (!inst) {
      throw new AppError("Institution not found", 404);
    }
    return inst.programs;
  },

  async addProgram(institutionId, programData) {
    const inst = await institutionsRepository.findById(institutionId);
    if (!inst) {
      throw new AppError("Institution not found", 404);
    }

    if (!programData.name || !programData.level) {
      throw new AppError("Program name and level required", 400);
    }

    const newProgram = {
      id: `prog-${Date.now()}`,
      ...programData,
    };

    inst.programs = inst.programs || [];
    inst.programs.push(newProgram);

    await institutionsRepository.update(institutionId, { programs: inst.programs });
    return newProgram;
  },

  async updateProgram(institutionId, programId, programData) {
    const inst = await institutionsRepository.findById(institutionId);
    if (!inst) {
      throw new AppError("Institution not found", 404);
    }

    const programIdx = inst.programs.findIndex((p) => p.id === programId);
    if (programIdx === -1) {
      throw new AppError("Program not found", 404);
    }

    inst.programs[programIdx] = { ...inst.programs[programIdx], ...programData, id: programId };
    await institutionsRepository.update(institutionId, { programs: inst.programs });
    return inst.programs[programIdx];
  },

  async deleteProgram(institutionId, programId) {
    const inst = await institutionsRepository.findById(institutionId);
    if (!inst) {
      throw new AppError("Institution not found", 404);
    }

    const programIdx = inst.programs.findIndex((p) => p.id === programId);
    if (programIdx === -1) {
      throw new AppError("Program not found", 404);
    }

    inst.programs.splice(programIdx, 1);
    await institutionsRepository.update(institutionId, { programs: inst.programs });
    return { success: true };
  },
};
