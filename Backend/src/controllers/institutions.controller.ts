import { NextFunction, Request, Response } from 'express';
import * as institutionsService from '../services/institutions.service';
import {
  createInstitutionSchema,
  listInstitutionsQuerySchema,
  updateInstitutionSchema,
} from '../validators/institution.schema';

export async function listInstitutions(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listInstitutionsQuerySchema.parse(req.query);
    const result = await institutionsService.listInstitutions(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getInstitution(req: Request, res: Response, next: NextFunction) {
  try {
    const institution = await institutionsService.getInstitutionById(req.params.id);
    res.json(institution);
  } catch (err) {
    next(err);
  }
}

export async function createInstitution(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createInstitutionSchema.parse(req.body);
    const institution = await institutionsService.createInstitution(data);
    res.status(201).json(institution);
  } catch (err) {
    next(err);
  }
}

export async function updateInstitution(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateInstitutionSchema.parse(req.body);
    const institution = await institutionsService.updateInstitution(req.params.id, data);
    res.json(institution);
  } catch (err) {
    next(err);
  }
}

export async function deleteInstitution(req: Request, res: Response, next: NextFunction) {
  try {
    await institutionsService.deleteInstitution(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function recordView(req: Request, res: Response, next: NextFunction) {
  try {
    await institutionsService.recordView(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
