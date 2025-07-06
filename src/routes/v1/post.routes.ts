import { Router } from 'express';
import { createPost } from '../../controllers/post.controller';
import { createComment } from '../../controllers/comment.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createPost);
router.post('/:postId/comments', protect, createComment);

export default router;
