import { Router } from 'express';
import { submitAssessment, getHistory } from '../controllers/assessmentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/submit', authenticateToken, submitAssessment);
router.get('/history', authenticateToken, getHistory);

export default router;
