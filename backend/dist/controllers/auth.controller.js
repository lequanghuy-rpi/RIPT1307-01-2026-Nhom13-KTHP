"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const error_middleware_1 = require("../middlewares/error.middleware");
exports.authController = {
    async getStats(req, res, next) {
        try {
            if (!req.user)
                throw new error_middleware_1.AppError("Chưa xác thực.", 401);
            const stats = await auth_service_1.authService.getStats(req.user.id);
            res.json({ success: true, data: stats });
        }
        catch (error) {
            next(error);
        }
    },
    async register(req, res, next) {
        try {
            const { username, email, password, confirmPassword } = req.body;
            if (!username || !email || !password || !confirmPassword) {
                throw new error_middleware_1.AppError("Vui lòng cung cấp đầy đủ thông tin", 400);
            }
            if (password !== confirmPassword) {
                throw new error_middleware_1.AppError("Mật khẩu xác nhận không khớp.", 400);
            }
            const result = await auth_service_1.authService.register({ username, email, password });
            res.status(201).json({ success: true, data: result, message: "Đăng ký thành công" });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new error_middleware_1.AppError("Vui lòng cung cấp email và mật khẩu", 400);
            }
            const result = await auth_service_1.authService.login({ email, password });
            res.json({ success: true, data: result, message: "Đăng nhập thành công" });
        }
        catch (error) {
            next(error);
        }
    },
    async getMe(req, res, next) {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError("Chưa xác thực.", 401);
            }
            const user = await auth_service_1.authService.getMe(req.user.id);
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    },
    async updateAvatar(req, res, next) {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError("Chưa xác thực.", 401);
            }
            const { avatar } = req.body;
            if (!avatar || typeof avatar !== 'string') {
                throw new error_middleware_1.AppError("Dữ liệu ảnh không hợp lệ.", 400);
            }
            const user = await auth_service_1.authService.updateAvatar(req.user.id, avatar);
            res.json({ success: true, data: user, message: "Ảnh đại diện đã được cập nhật!" });
        }
        catch (error) {
            next(error);
        }
    },
    async removeAvatar(req, res, next) {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError("Chưa xác thực.", 401);
            }
            const user = await auth_service_1.authService.removeAvatar(req.user.id);
            res.json({ success: true, data: user, message: "Đã xóa ảnh đại diện." });
        }
        catch (error) {
            next(error);
        }
    },
    async changePassword(req, res, next) {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError("Chưa xác thực.", 401);
            }
            const { currentPassword, newPassword, confirmPassword } = req.body;
            if (!currentPassword || !newPassword || !confirmPassword) {
                throw new error_middleware_1.AppError("Vui lòng cung cấp đầy đủ thông tin.", 400);
            }
            if (newPassword !== confirmPassword) {
                throw new error_middleware_1.AppError("Mật khẩu xác nhận không khớp.", 400);
            }
            if (newPassword.length < 6) {
                throw new error_middleware_1.AppError("Mật khẩu mới phải từ 6 ký tự trở lên.", 400);
            }
            await auth_service_1.authService.changePassword(req.user.id, currentPassword, newPassword);
            res.json({ success: true, data: null, message: "Đổi mật khẩu thành công!" });
        }
        catch (error) {
            next(error);
        }
    },
    async deleteAccount(req, res, next) {
        try {
            if (!req.user) {
                throw new error_middleware_1.AppError("Chưa xác thực.", 401);
            }
            await auth_service_1.authService.deleteAccount(req.user.id);
            res.json({ success: true, data: null, message: "Tài khoản đã được xóa vĩnh viễn." });
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=auth.controller.js.map