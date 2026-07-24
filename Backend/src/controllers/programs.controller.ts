import { NextFunction, Request, Response } from 'express';
import * as programsService from '../services/programs.service';
import { createProgramSchema, updateProgramSchema } from '../validators/program.schema';

export async function listPrograms(req: Request, res: Response, next: NextFunction) {
  try {
    const programs = await programsService.listProgramsForInstitution(req.params.institutionId);
    res.json(programs);
  } catch (err) {
    next(err);
  }
}

export async function createProgram(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createProgramSchema.parse(req.body);
    const program = await programsService.createProgram(req.params.institutionId, data);
    res.status(201).json(program);
  } catch (err) {
    next(err);
  }
}

export async function updateProgram(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProgramSchema.parse(req.body);
    const program = await programsService.updateProgram(
      req.params.institutionId,
      req.params.programId,
      data,
    );
    res.json(program);
  } catch (err) {
    next(err);
  }
}

export async function deleteProgram(req: Request, res: Response, next: NextFunction) {
  try {
    await programsService.deleteProgram(req.params.institutionId, req.params.programId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
