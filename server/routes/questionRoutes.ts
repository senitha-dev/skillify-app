import { Router } from 'express';
import { getQuestions } from '../controllers/questionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getQuestions);

export default router;
