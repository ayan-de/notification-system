import { Router } from 'express';
import authRoutes from './auth.routes';
import followRoutes from './follow.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', followRoutes);

export default router;
