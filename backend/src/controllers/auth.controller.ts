import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AppError } from "../middlewares/error.middleware";

export const authController = {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new AppError("Chưa xác thực.", 401);
      const stats = await authService.getStats(req.user.id);
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!username || !email || !password || !confirmPassword) {
         throw new AppError("Vui lòng cung cấp đầy đủ thông tin", 400);
      }

      if (password !== confirmPassword) {
        throw new AppError("Mật khẩu xác nhận không khớp.", 400);
      }

      const result = await authService.register({ username, email, password });
      
      res.status(201).json({ success: true, data: result, message: "Đăng ký thành công" });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
         throw new AppError("Vui lòng cung cấp email và mật khẩu", 400);
      }
      
      const result = await authService.login({ email, password });
      
      res.json({ success: true, data: result, message: "Đăng nhập thành công" });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Chưa xác thực.", 401);
      }
      
      const user = await authService.getMe(req.user.id);
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Chưa xác thực.", 401);
      }
      const { avatar } = req.body;
      if (!avatar || typeof avatar !== 'string') {
        throw new AppError("Dữ liệu ảnh không hợp lệ.", 400);
      }
      const user = await authService.updateAvatar(req.user.id, avatar);
      res.json({ success: true, data: user, message: "Ảnh đại diện đã được cập nhật!" });
    } catch (error) {
      next(error);
    }
  },

  async removeAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Chưa xác thực.", 401);
      }
      const user = await authService.removeAvatar(req.user.id);
      res.json({ success: true, data: user, message: "Đã xóa ảnh đại diện." });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Chưa xác thực.", 401);
      }
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new AppError("Vui lòng cung cấp đầy đủ thông tin.", 400);
      }
      if (newPassword !== confirmPassword) {
        throw new AppError("Mật khẩu xác nhận không khớp.", 400);
      }
      if (newPassword.length < 6) {
        throw new AppError("Mật khẩu mới phải từ 6 ký tự trở lên.", 400);
      }
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      res.json({ success: true, data: null, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError("Chưa xác thực.", 401);
      }
      await authService.deleteAccount(req.user.id);
      res.json({ success: true, data: null, message: "Tài khoản đã được xóa vĩnh viễn." });
    } catch (error) {
      next(error);
    }
  }
};
