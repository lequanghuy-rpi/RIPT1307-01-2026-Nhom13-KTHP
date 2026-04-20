"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
exports.notificationService = {
    async createNotification(userId, title, message, type = "SYSTEM") {
        try {
            await prisma_1.default.notification.create({
                data: {
                    userId,
                    title,
                    message,
                    type,
                },
            });
        }
        catch (error) {
            console.error("Lỗi tạo notification:", error);
        }
    },
    async broadcastNotification(title, message, type = "SYSTEM") {
        try {
            const users = await prisma_1.default.user.findMany({ select: { id: true } });
            const notifications = users.map(user => ({
                userId: user.id,
                title,
                message,
                type
            }));
            await prisma_1.default.notification.createMany({
                data: notifications
            });
        }
        catch (error) {
            console.error("Lỗi tạo broadcast notification:", error);
            throw error;
        }
    }
};
//# sourceMappingURL=notification.service.js.map