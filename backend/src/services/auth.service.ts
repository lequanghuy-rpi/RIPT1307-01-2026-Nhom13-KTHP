import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import config from "../config/env";
import { AppError } from "../middlewares/error.middleware";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const signToken = (payload: { id: string; email: string; role: string }) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: "7d", // Yêu cầu expire 7d
  } as jwt.SignOptions);

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError("Email đã được sử dụng.", 400);
    }

    // Hash password bcrypt(10)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // role mặc định = USER
    const user = await prisma.user.create({
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

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new AppError("Email hoặc mật khẩu không đúng.", 401);
    }

    // bcrypt.compare
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError("Email hoặc mật khẩu không đúng.", 401);
    }

    // tạo JWT expire 7d
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("Không tìm thấy người dùng.", 404);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getStats(userId: string) {
    const registrations = await prisma.registration.findMany({
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

  async updateAvatar(userId: string, avatarBase64: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarBase64 },
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async removeAvatar(userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Lấy user kèm password để xác minh
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("Không tìm thấy người dùng.", 404);
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("Mật khẩu hiện tại không đúng.", 400);
    }

    // Hash mật khẩu mới và lưu
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  },

  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("Không tìm thấy người dùng.", 404);
    }
    if (user.role === 'ADMIN') {
      throw new AppError("Không thể xóa tài khoản Quản trị viên.", 403);
    }

    await prisma.$transaction(async (tx) => {
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
