import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/error.middleware";
import prisma from "../config/prisma";
import { notificationService } from "../services/notification.service";

export const notificationController = {
  async getMy(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Truy cập bị từ chối", 401);
      
      const { page = 1, limit = 10, status } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      const where: any = { userId: req.user.id };
      if (status === 'unread') where.isRead = false;
      if (status === 'read') where.isRead = true;

      const [total, data] = await Promise.all([
        prisma.notification.count({ where }),
        prisma.notification.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: "desc" }
        })
      ]);

      res.json({ success: true, data: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)), data } });
    } catch (error) {
      next(error);
    }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Truy cập bị từ chối", 401);
      const count = await prisma.notification.count({
        where: { userId: req.user.id, isRead: false }
      });
      res.json({ success: true, data: { count } });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Truy cập bị từ chối", 401);
      const id = req.params.id as string;

      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification || notification.userId !== req.user.id) {
        throw new AppError("Không tìm thấy thông báo", 404);
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("Truy cập bị từ chối", 401);
      
      const result = await prisma.notification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true }
      });

      res.json({ success: true, message: `Đã đánh dấu ${result.count} thông báo là đã đọc` });
    } catch (error) {
      next(error);
    }
  },

  async broadcast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        throw new AppError("Truy cập bị từ chối", 403);
      }
      const { title, message } = req.body;
      if (!title || !message) {
        throw new AppError("Thiếu thông tin tiêu đề hoặc nội dung", 400);
      }
      await notificationService.broadcastNotification(title, message);
      res.json({ success: true, message: "Đã gửi thông báo đến tất cả người dùng" });
    } catch (error) {
      next(error);
    }
  }
};
