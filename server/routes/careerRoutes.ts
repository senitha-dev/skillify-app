import { Router } from 'express';
import { getCareerPaths } from '../controllers/careerController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getCareerPaths);

export default router;
