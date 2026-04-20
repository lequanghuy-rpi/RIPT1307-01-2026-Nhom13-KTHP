"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const env_1 = __importDefault(require("../config/env"));
const error_middleware_1 = require("../middlewares/error.middleware");
const signToken = (payload) => jsonwebtoken_1.default.sign(payload, env_1.default.jwt.secret, {
    expiresIn: "7d", // Yêu cầu expire 7d
});
exports.authService = {
    async register(data) {
        const existing = await prisma_1.default.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new error_middleware_1.AppError("Email đã được sử dụng.", 400);
        }
        // Hash password bcrypt(10)
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        // role mặc định = USER
        const user = await prisma_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                username: data.username,
                role: "USER",
            },
        });
        const token = signToken({ id: user.id, email: user.email, role: user.role });
        // user(không có password)
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    },
    async login(data) {
        const user = await prisma_1.default.user.findUnique({ where: { email: data.email } });
        if (!user) {
            throw new error_middleware_1.AppError("Email hoặc mật khẩu không đúng.", 401);
        }
        // bcrypt.compare
        const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isMatch) {
            throw new error_middleware_1.AppError("Email hoặc mật khẩu không đúng.", 401);
        }
        // tạo JWT expire 7d
        const token = signToken({ id: user.id, email: user.email, role: user.role });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    },
    async getMe(userId) {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new error_middleware_1.AppError("Không tìm thấy người dùng.", 404);
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    async getStats(userId) {
        const registrations = await prisma_1.default.registration.findMany({
            where: { userId },
            select: { kills: true, top1Count: true }
        });
        const tournamentsJoined = registrations.length;
        const totalKills = registrations.reduce((sum, r) => sum + (r.kills || 0), 0);
        const totalTop1 = registrations.reduce((sum, r) => sum + (r.top1Count || 0), 0);
        return {
            tournamentsJoined,
            totalKills,
            totalTop1
        };
    },
    async updateAvatar(userId, avatarBase64) {
        const user = await prisma_1.default.user.update({
            where: { id: userId },
            data: { avatar: avatarBase64 },
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    async removeAvatar(userId) {
        const user = await prisma_1.default.user.update({
            where: { id: userId },
            data: { avatar: null },
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    async changePassword(userId, currentPassword, newPassword) {
        // Lấy user kèm password để xác minh
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new error_middleware_1.AppError("Không tìm thấy người dùng.", 404);
        }
        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new error_middleware_1.AppError("Mật khẩu hiện tại không đúng.", 400);
        }
        // Hash mật khẩu mới và lưu
        const hashed = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashed },
        });
    },
    async deleteAccount(userId) {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new error_middleware_1.AppError("Không tìm thấy người dùng.", 404);
        }
        if (user.role === 'ADMIN') {
            throw new error_middleware_1.AppError("Không thể xóa tài khoản Quản trị viên.", 403);
        }
        await prisma_1.default.$transaction(async (tx) => {
            // 1. Xóa notifications
            await tx.notification.deleteMany({ where: { userId } });
            // 2. Lấy các registration của user để xử lý references
            const regs = await tx.registration.findMany({ where: { userId } });
            const regIds = regs.map(r => r.id);
            if (regIds.length > 0) {
                // Gỡ liên kết team trong matches
                await tx.match.updateMany({
                    where: { team1Id: { in: regIds } },
                    data: { team1Id: null }
                });
                await tx.match.updateMany({
                    where: { team2Id: { in: regIds } },
                    data: { team2Id: null }
                });
                // reg_members có onDelete: Cascade nên sẽ tự động bị xóa khi xóa registration
                await tx.registration.deleteMany({ where: { userId } });
            }
            // 3. Cuối cùng xóa user
            await tx.user.delete({ where: { id: userId } });
        });
    }
};
//# sourceMappingURL=auth.service.js.map