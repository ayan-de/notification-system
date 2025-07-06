import prisma from '../DB/db.cofig';
import { NotificationType, ResourceType } from '../generated/prisma';

interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  resourceType?: ResourceType;
  resourceId?: string;
  actorId?: string;
}

export const createNotification = async (data: CreateNotificationData) => {
  return prisma.notification.create({
    data,
  });
};

export const createNotificationForFollowers = async (
  userId: string,
  data: Omit<CreateNotificationData, 'userId'>
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { followers: true },
  });

  if (!user) {
    return;
  }

  const notifications = user.followers.map((follow) => {
    return prisma.notification.create({
      data: {
        ...data,
        userId: follow.followerId,
      },
    });
  });

  await Promise.all(notifications);
};
