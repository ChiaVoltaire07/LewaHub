import { Router } from 'express';
import * as institutionsController from '../controllers/institutions.controller';
import programsRouter from './programs.routes';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// 30 view-pings per minute per IP — cheap to abuse otherwise since it needs no auth
const viewLimiter = createRateLimiter(60 * 1000, 30);

router.get('/', institutionsController.listInstitutions);
router.get('/:id', institutionsController.getInstitution);
router.post('/', institutionsController.createInstitution); // TODO: Part 2 adds requireAuth here
router.put('/:id', institutionsController.updateInstitution); // TODO: Part 2 adds requireAuth here
router.delete('/:id', institutionsController.deleteInstitution); // TODO: Part 2 adds requireAuth here
router.post('/:id/view', viewLimiter, institutionsController.recordView);

router.use('/:institutionId/programs', programsRouter);

export default router;
