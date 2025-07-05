import { RequestHandler } from 'express';
import prisma from '../DB/db.cofig';
import { JwtPayload } from './auth.controller';

// @desc    Follow a user
// @route   POST /api/v1/users/:id/follow
export const followUser: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const loggedInUserId = (req as any).user.id;
    const userToFollowId = req.params.id;

    if (loggedInUserId === userToFollowId) {
      res.status(400).json({ success: false, message: 'You cannot follow yourself' });
      return;
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: loggedInUserId,
          followingId: userToFollowId,
        },
      },
    });

    if (existingFollow) {
      res.status(400).json({ success: false, message: 'You are already following this user' });
      return;
    }

    await prisma.follow.create({
      data: {
        followerId: loggedInUserId,
        followingId: userToFollowId,
      },
    });

    res.status(200).json({ success: true, message: 'User followed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   POST /api/v1/users/:id/unfollow
export const unfollowUser: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const loggedInUserId = (req as any).user.id;
    const userToUnfollowId = req.params.id;

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: loggedInUserId,
          followingId: userToUnfollowId,
        },
      },
    });

    if (!existingFollow) {
      res.status(400).json({ success: false, message: 'You are not following this user' });
      return;
    }

    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });

    res.status(200).json({ success: true, message: 'User unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get followers of a user
// @route   GET /api/v1/users/:id/followers
export const getFollowers: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: true },
    });

    res.status(200).json({ success: true, data: followers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users a user is following
// @route   GET /api/v1/users/:id/following
export const getFollowing: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: true },
    });

    res.status(200).json({ success: true, data: following });
  } catch (error) {
    next(error);
  }
};
