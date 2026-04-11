import { Router } from 'express';
import { getResources } from '../controllers/resourceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getResources);

export default router;
