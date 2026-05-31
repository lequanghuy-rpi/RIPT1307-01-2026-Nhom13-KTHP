"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
// ──────────────────────────────────────────────────────────────
// Custom AppError class
// ──────────────────────────────────────────────────────────────
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// ──────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// ──────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, _next) => {
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
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
            const fields = err.meta?.target?.join(", ") || "field";
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
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
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
        message: isDev ? err.message : "Đã xảy ra lỗi hệ thống. Vui lòng thử lại.",
        ...(isDev && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map