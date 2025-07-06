"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const db_cofig_1 = __importDefault(require("../DB/db.cofig"));
// @desc    Get notifications for the logged in user
// @route   GET /api/v1/notifications
const getNotifications = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;
        const notifications = await db_cofig_1.default.notification.findMany({
            where: { userId: loggedInUserId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, data: notifications });
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
// @desc    Mark a notification as read
// @route   PATCH /api/v1/notifications/:id/read
const markAsRead = async (req, res, next) => {
    try {
        const loggedInUserId = req.user.id;
        const notificationId = req.params.id;
        const notification = await db_cofig_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            res.status(404).json({ success: false, message: 'Notification not found' });
            return;
        }
        if (notification.userId !== loggedInUserId) {
            res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
            return;
        }
        const updatedNotification = await db_cofig_1.default.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
        res.status(200).json({ success: true, data: updatedNotification });
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
