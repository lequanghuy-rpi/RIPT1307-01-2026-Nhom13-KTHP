import nodemailer from "nodemailer";
import config from "../config/env";

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.port === 465, // true for 465, false for other ports
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

export const emailService = {
  async sendRegistrationEmail(to: string, status: "APPROVED" | "REJECTED", note?: string) {
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
        from: config.mail.from,
        to,
        subject,
        text,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
    }
  }
};
