import { RequestHandler } from 'express';
import prisma from '../DB/db.cofig';
import { createNotification } from '../services/notification.service';
import { NotificationType, ResourceType } from '../generated/prisma';

interface CreateCommentRequest {
  content: string;
}

// @desc    Create a new comment on a post
// @route   POST /api/v1/posts/:postId/comments
export const createComment: RequestHandler<{ postId: string }, {}, CreateCommentRequest> = async (req, res, next) => {
  try {
    const loggedInUserId = (req as any).user.id;
    const { content } = req.body;
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: loggedInUserId,
        postId,
      },
    });

    // Notify the post author
    if (post.authorId !== loggedInUserId) {
      await createNotification({
        userId: post.authorId,
        type: NotificationType.COMMENT,
        title: 'New Comment on Your Post',
        message: `Someone commented on your post: ${comment.content}`,
        resourceType: ResourceType.POST,
        resourceId: postId,
        actorId: loggedInUserId,
      });
    }

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};
