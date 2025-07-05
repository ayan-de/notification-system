import { Router } from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../../controllers/follow.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

export default router;
