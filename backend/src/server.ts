import app from "./app";
import prisma from "./config/prisma";
import config from "./config/env";

// ──────────────────────────────────────────────────────────────
// Start Server & Test DB Connection
// ──────────────────────────────────────────────────────────────

async function bootstrap() {
  // Test Prisma / MySQL connection
  try {
    await prisma.$connect();
    console.log("✅ Kết nối MySQL thành công!");
  } catch (error) {
    console.error("❌ Không thể kết nối MySQL:", error);
    process.exit(1);
  }

  // Start HTTP server
  const server = app.listen(config.port, () => {
    console.log("──────────────────────────────────────────");
    console.log(`🚀 Server đang chạy tại: http://localhost:${config.port}`);
    console.log(`📋 Môi trường: ${config.nodeEnv}`);
    console.log(`🏥 Health check: http://localhost:${config.port}/health`);
    console.log("──────────────────────────────────────────");
  });

  // ── Graceful Shutdown ─────────────────────────────────────
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n⚠️  Nhận tín hiệu ${signal}. Đang tắt server...`);

    server.close(async () => {
      await prisma.$disconnect();
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
