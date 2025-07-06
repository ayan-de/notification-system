"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = void 0;
const db_cofig_1 = __importDefault(require("../DB/db.cofig"));
const notification_service_1 = require("../services/notification.service");
const prisma_1 = require("../generated/prisma");
// @desc    Create a new comment on a post
// @route   POST /api/v1/posts/:postId/comments
const createComment = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;
        const { content } = req.body;
        const { postId } = req.params;
        const post = await db_cofig_1.default.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            res.status(404).json({ success: false, message: 'Post not found' });
            return;
        }
        const comment = await db_cofig_1.default.comment.create({
            data: {
                content,
                authorId: loggedInUserId,
                postId,
            },
        });
        // Notify the post author
        if (post.authorId !== loggedInUserId) {
            await (0, notification_service_1.createNotification)({
                userId: post.authorId,
                type: prisma_1.NotificationType.COMMENT,
                title: 'New Comment on Your Post',
                message: `Someone commented on your post: ${comment.content}`,
                resourceType: prisma_1.ResourceType.POST,
                resourceId: postId,
                actorId: loggedInUserId,
            });
        }
        res.status(201).json({ success: true, data: comment });
    }
    catch (error) {
        next(error);
    }
};
exports.createComment = createComment;
