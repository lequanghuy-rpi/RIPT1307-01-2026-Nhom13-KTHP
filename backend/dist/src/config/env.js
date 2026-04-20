"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
function validateEnv() {
    const missing = [];
    for (const key of requiredEnvVars) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }
    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
    return {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
    };
}
validateEnv();
exports.config = {
    port: parseInt(process.env.PORT || "5000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    },
    mail: {
        host: process.env.MAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.MAIL_PORT || "587", 10),
        user: process.env.MAIL_USER || "",
        pass: process.env.MAIL_PASS || "",
        from: process.env.MAIL_FROM || "noreply@esports.com",
    },
};
exports.default = exports.config;
//# sourceMappingURL=env.js.map