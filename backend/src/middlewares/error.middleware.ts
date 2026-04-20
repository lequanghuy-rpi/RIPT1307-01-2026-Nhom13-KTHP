import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

// ──────────────────────────────────────────────────────────────
// Custom AppError class
// ──────────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ──────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.path}:`, err);

  // ── Operational / known errors ──────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
    });
    return;
  }

  // ── Prisma: record not found ────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        data: null,
        message: "Không tìm thấy dữ liệu yêu cầu.",
      });
      return;
    }

    // Unique constraint violation
    if (err.code === "P2002") {
      const fields = (err.meta?.target as string[])?.join(", ") || "field";
      res.status(409).json({
        success: false,
        data: null,
        message: `Dữ liệu đã tồn tại: ${fields}.`,
      });
      return;
    }

    // Foreign key constraint
    if (err.code === "P2003") {
      res.status(400).json({
        success: false,
        data: null,
        message: "Tham chiếu dữ liệu không hợp lệ (khóa ngoại).",
      });
      return;
    }
  }

  // ── Prisma: validation error ────────────────────────────────
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Dữ liệu đầu vào không hợp lệ: " + err.message,
    });
    return;
  }

  // ── JWT errors ──────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      data: null,
      message: "Token không hợp lệ.",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      data: null,
      message: "Token đã hết hạn. Vui lòng đăng nhập lại.",
    });
    return;
  }

  // ── Default: Internal Server Error ─────────────────────────
  const isDev = process.env.NODE_ENV === "development";
  res.status(500).json({
    success: false,
    data: null,
    message: err.message || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại.",
    ...(isDev && { stack: err.stack }),
  });
};
