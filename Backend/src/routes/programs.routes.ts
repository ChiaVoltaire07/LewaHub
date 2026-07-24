import { Router } from 'express';
import * as programsController from '../controllers/programs.controller';

// mergeParams so this router can read :institutionId from the parent route
const router = Router({ mergeParams: true });

router.get('/', programsController.listPrograms);
router.post('/', programsController.createProgram); // TODO: Part 2 adds requireAuth here
router.put('/:programId', programsController.updateProgram); // TODO: Part 2 adds requireAuth here
router.delete('/:programId', programsController.deleteProgram); // TODO: Part 2 adds requireAuth here

export default router;
