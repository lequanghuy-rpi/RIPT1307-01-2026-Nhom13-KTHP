"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
/**
 * @deprecated TypeORM đã được thay thế bằng Prisma.
 * File này được giữ để không break imports cũ.
 * Hãy import từ "../config/prisma" thay thế.
 */
var prisma_1 = require("./prisma");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return __importDefault(prisma_1).default; } });
//# sourceMappingURL=data-source.js.map