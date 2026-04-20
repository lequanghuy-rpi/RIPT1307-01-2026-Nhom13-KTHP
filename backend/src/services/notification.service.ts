import prisma from "../config/prisma";

export const notificationService = {
  async createNotification(userId: string, title: string, message: string, type: string = "SYSTEM") {
    try {
      await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
        },
      });
    } catch (error) {
      console.error("Lỗi tạo notification:", error);
    }
  },

  async broadcastNotification(title: string, message: string, type: string = "SYSTEM") {
    try {
      const users = await prisma.user.findMany({ select: { id: true } });
      const notifications = users.map(user => ({
        userId: user.id,
        title,
        message,
        type
      }));
      await prisma.notification.createMany({
        data: notifications
      });
    } catch (error) {
      console.error("Lỗi tạo broadcast notification:", error);
      throw error;
    }
  }
};
