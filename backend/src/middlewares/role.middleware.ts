import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const roleMiddleware = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Chưa xác thực. Vui lòng đăng nhập." });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ message: `Truy cập bị từ chối. Yêu cầu quyền: ${role}.` });
      return;
    }

    next();
  };
};
