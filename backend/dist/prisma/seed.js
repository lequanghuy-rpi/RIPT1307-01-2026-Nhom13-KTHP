"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Bắt đầu làm sạch và nạp lại dữ liệu (Seed)...");
    // Xóa sạch dữ liệu cũ
    await prisma.regMember.deleteMany();
    await prisma.registration.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcryptjs_1.default.hash("123456", 10);
    // 1. Tạo 1 tài khoản ADMIN
    const admin = await prisma.user.create({
        data: {
            username: "admin",
            email: "admin@example.com",
            password: passwordHash,
            role: client_1.Role.ADMIN,
        },
    });
    // 2. Tạo 1 tài khoản USER
    const user = await prisma.user.create({
        data: {
            username: "huy_user",
            email: "user@example.com",
            password: passwordHash,
            role: client_1.Role.USER,
        },
    });
    console.log("Đã tạo 1 Admin và 1 User mẫu.");
    // 3. Tạo 1 Giải đấu mẫu
    const tournament = await prisma.tournament.create({
        data: {
            name: "Giải đấu Esports Mùa Hè 2026",
            game: "League of Legends",
            description: "Giải đấu dành cho sinh viên KTHP",
            startDate: new Date("2026-06-01T09:00:00Z"),
            endDate: new Date("2026-06-15T18:00:00Z"),
            maxTeams: 16,
            status: client_1.TournamentStatus.UPCOMING,
            createdById: admin.id,
        },
    });
    console.log("Đã tạo 1 giải đấu mẫu.");
    // 4. Tạo 1 Đơn đăng ký mẫu cho User trên
    await prisma.registration.create({
        data: {
            tournamentId: tournament.id,
            userId: user.id,
            teamName: "KTHP Warriors",
            status: client_1.RegistrationStatus.PENDING,
            members: {
                create: [
                    { memberName: "Huy Captain", gameId: "Huy123" },
                    { memberName: "Player 2", gameId: "ID2" },
                    { memberName: "Player 3", gameId: "ID3" },
                    { memberName: "Player 4", gameId: "ID4" },
                    { memberName: "Player 5", gameId: "ID5" },
                ]
            }
        }
    });
    console.log("Đã tạo 1 đơn đăng ký mẫu.");
    console.log("==========================================");
    console.log("🎉 Hoàn tất Seeding dữ liệu!");
    console.log("Bạn có thể dùng các tài khoản mẫu sau để test:");
    console.log("👑 ADMIN:");
    console.log("   - Email: admin@example.com");
    console.log("   - Mật khẩu: 123456");
    console.log("👤 USER:");
    console.log("   - Email: user@example.com");
    console.log("   - Mật khẩu: 123456");
    console.log("==========================================");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map