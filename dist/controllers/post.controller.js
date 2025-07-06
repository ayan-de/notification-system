"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const db_cofig_1 = __importDefault(require("../DB/db.cofig"));
const notification_service_1 = require("../services/notification.service");
const prisma_1 = require("../generated/prisma");
// @desc    Create a new post
// @route   POST /api/v1/posts
const createPost = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;
        const { content } = req.body;
        const post = await db_cofig_1.default.post.create({
            data: {
                content,
                authorId: loggedInUserId,
            },
        });
        await (0, notification_service_1.createNotificationForFollowers)(loggedInUserId, {
            type: prisma_1.NotificationType.POST,
            title: 'New Post from a user you follow',
            message: `A user you follow has created a new post: ${post.content}`,
            resourceType: prisma_1.ResourceType.POST,
            resourceId: post.id,
            actorId: loggedInUserId,
        });
        res.status(201).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
};
exports.createPost = createPost;
