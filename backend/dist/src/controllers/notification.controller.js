"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const error_middleware_1 = require("../middlewares/error.middleware");
const prisma_1 = __importDefault(require("../config/prisma"));
const notification_service_1 = require("../services/notification.service");
exports.notificationController = {
    async getMy(req, res, next) {
        try {
            if (!req.user)
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 401);
            const { page = 1, limit = 10, status } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const take = Number(limit);
            const where = { userId: req.user.id };
            if (status === 'unread')
                where.isRead = false;
            if (status === 'read')
                where.isRead = true;
            const [total, data] = await Promise.all([
                prisma_1.default.notification.count({ where }),
                prisma_1.default.notification.findMany({
                    where,
                    skip,
                    take,
                    orderBy: { createdAt: "desc" }
                })
            ]);
            res.json({ success: true, data: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)), data } });
        }
        catch (error) {
            next(error);
        }
    },
    async getUnreadCount(req, res, next) {
        try {
            if (!req.user)
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 401);
            const count = await prisma_1.default.notification.count({
                where: { userId: req.user.id, isRead: false }
            });
            res.json({ success: true, data: { count } });
        }
        catch (error) {
            next(error);
        }
    },
    async markAsRead(req, res, next) {
        try {
            if (!req.user)
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 401);
            const id = req.params.id;
            const notification = await prisma_1.default.notification.findUnique({ where: { id } });
            if (!notification || notification.userId !== req.user.id) {
                throw new error_middleware_1.AppError("Không tìm thấy thông báo", 404);
            }
            const updated = await prisma_1.default.notification.update({
                where: { id },
                data: { isRead: true }
            });
            res.json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    },
    async markAllAsRead(req, res, next) {
        try {
            if (!req.user)
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 401);
            const result = await prisma_1.default.notification.updateMany({
                where: { userId: req.user.id, isRead: false },
                data: { isRead: true }
            });
            res.json({ success: true, message: `Đã đánh dấu ${result.count} thông báo là đã đọc` });
        }
        catch (error) {
            next(error);
        }
    },
    async broadcast(req, res, next) {
        try {
            if (!req.user || req.user.role !== 'ADMIN') {
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 403);
            }
            const { title, message } = req.body;
            if (!title || !message) {
                throw new error_middleware_1.AppError("Thiếu thông tin tiêu đề hoặc nội dung", 400);
            }
            await notification_service_1.notificationService.broadcastNotification(title, message);
            res.json({ success: true, message: "Đã gửi thông báo đến tất cả người dùng" });
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=notification.controller.js.map