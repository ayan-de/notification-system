import { Router } from 'express';
import authRoutes from './auth.routes';
import followRoutes from './follow.routes';
import postRoutes from './post.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', followRoutes);
router.use('/posts', postRoutes);
router.use('/notifications', notificationRoutes);

export default router;
