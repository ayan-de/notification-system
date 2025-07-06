import { RequestHandler } from 'express';
import prisma from '../DB/db.cofig';
import { createNotificationForFollowers } from '../services/notification.service';
import { NotificationType, ResourceType } from '../generated/prisma';

interface CreatePostRequest {
  content: string;
}

// @desc    Create a new post
// @route   POST /api/v1/posts
export const createPost: RequestHandler<{}, {}, CreatePostRequest> = async (req, res, next) => {
  try {
    const loggedInUserId = (req as any).user.id;
    const { content } = req.body;

    const post = await prisma.post.create({
      data: {
        content,
        authorId: loggedInUserId,
      },
    });

    await createNotificationForFollowers(loggedInUserId, {
      type: NotificationType.POST,
      title: 'New Post from a user you follow',
      message: `A user you follow has created a new post: ${post.content}`,
      resourceType: ResourceType.POST,
      resourceId: post.id,
      actorId: loggedInUserId,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};
