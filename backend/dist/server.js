"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./config/prisma"));
const env_1 = __importDefault(require("./config/env"));
// ──────────────────────────────────────────────────────────────
// Start Server & Test DB Connection
// ──────────────────────────────────────────────────────────────
async function bootstrap() {
    // Test Prisma / MySQL connection
    try {
        await prisma_1.default.$connect();
        console.log("✅ Kết nối MySQL thành công!");
    }
    catch (error) {
        console.error("❌ Không thể kết nối MySQL:", error);
        process.exit(1);
    }
    // Start HTTP server
    const server = app_1.default.listen(env_1.default.port, () => {
        console.log("──────────────────────────────────────────");
        console.log(`🚀 Server đang chạy tại: http://localhost:${env_1.default.port}`);
        console.log(`📋 Môi trường: ${env_1.default.nodeEnv}`);
        console.log(`🏥 Health check: http://localhost:${env_1.default.port}/health`);
        console.log("──────────────────────────────────────────");
    });
    // ── Graceful Shutdown ─────────────────────────────────────
    const gracefulShutdown = async (signal) => {
        console.log(`\n⚠️  Nhận tín hiệu ${signal}. Đang tắt server...`);
        server.close(async () => {
            await prisma_1.default.$disconnect();
            console.log("✅ Đã ngắt kết nối database.");
            console.log("👋 Server đã tắt.");
            process.exit(0);
        });
        // Force exit after 10s
        setTimeout(() => {
            console.error("❌ Buộc tắt sau timeout.");
            process.exit(1);
        }, 10_000);
    };
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    // Handle unhandled rejections
    process.on("unhandledRejection", (reason) => {
        console.error("❌ Unhandled Rejection:", reason);
    });
    process.on("uncaughtException", (error) => {
        console.error("❌ Uncaught Exception:", error);
        process.exit(1);
    });
}
bootstrap();
//# sourceMappingURL=server.js.map