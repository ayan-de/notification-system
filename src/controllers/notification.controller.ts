import { RequestHandler } from 'express';
import prisma from '../DB/db.cofig';

// @desc    Get notifications for the logged in user
// @route   GET /api/v1/notifications
export const getNotifications: RequestHandler = async (req, res, next) => {
  try {
    const loggedInUserId = (req as any).user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId: loggedInUserId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/v1/notifications/:id/read
export const markAsRead: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const loggedInUserId = (req as any).user.id;
    const notificationId = req.params.id;

    const notification = await prisma.notification.findUnique({
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

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.status(200).json({ success: true, data: updatedNotification });
  } catch (error) {
    next(error);
  }
};
