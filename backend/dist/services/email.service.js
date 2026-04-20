"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../config/env"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.default.mail.host,
    port: env_1.default.mail.port,
    secure: env_1.default.mail.port === 465, // true for 465, false for other ports
    auth: {
        user: env_1.default.mail.user,
        pass: env_1.default.mail.pass,
    },
});
exports.emailService = {
    async sendRegistrationEmail(to, status, note) {
        try {
            const subject = status === "APPROVED"
                ? "Đơn đăng ký giải đấu đã được DUYỆT"
                : "Đơn đăng ký giải đấu đã bị TỪ CHỐI";
            let text = `Chào bạn,\n\nĐơn đăng ký tham gia giải đấu của bạn đã được ${status === "APPROVED" ? "DUYỆT thành công" : "TỪ CHỐI"}.\n`;
            if (note) {
                text += `\nGhi chú từ ban tổ chức: ${note}\n`;
            }
            text += `\nTrân trọng,\nEsports Tournament Team.`;
            await transporter.sendMail({
                from: env_1.default.mail.from,
                to,
                subject,
                text,
            });
            console.log(`Email sent to ${to}`);
        }
        catch (error) {
            console.error("Lỗi khi gửi email:", error);
        }
    }
};
//# sourceMappingURL=email.service.js.map