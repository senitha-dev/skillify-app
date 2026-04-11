import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import assessmentRoutes from './assessmentRoutes';
import careerRoutes from './careerRoutes';
import resourceRoutes from './resourceRoutes';
import questionRoutes from './questionRoutes';
import seedRoutes from './seedRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/career-paths', careerRoutes);
router.use('/resources', resourceRoutes);
router.use('/questions', questionRoutes);
router.use('/seed', seedRoutes);

export default router;
