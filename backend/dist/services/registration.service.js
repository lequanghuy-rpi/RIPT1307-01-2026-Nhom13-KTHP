"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
const client_1 = require("@prisma/client");
const email_service_1 = require("./email.service");
exports.registrationService = {
    async createRegistration(userId, data) {
        const { tournamentId, teamName, teamLogo, members } = data;
        // 1. Kiểm tra tournament tồn tại và UPCOMING
        const tournament = await prisma_1.default.tournament.findUnique({
            where: { id: tournamentId },
            include: {
                _count: {
                    select: { registrations: { where: { status: client_1.RegistrationStatus.APPROVED } } }
                }
            }
        });
        if (!tournament)
            throw new error_middleware_1.AppError("Không tìm thấy giải đấu", 404);
        if (tournament.status !== client_1.TournamentStatus.UPCOMING) {
            throw new error_middleware_1.AppError("Giải đấu không ở trạng thái sắp diễn ra (UPCOMING)", 400);
        }
        // 2. Kiểm tra maxTeams
        if (tournament._count.registrations >= tournament.maxTeams) {
            throw new error_middleware_1.AppError("Giải đấu đã đủ số lượng đội", 400);
        }
        // 3. Kiểm tra user đã đăng ký chưa
        const existingReg = await prisma_1.default.registration.findUnique({
            where: { tournamentId_userId: { tournamentId, userId } }
        });
        if (existingReg) {
            throw new error_middleware_1.AppError("Bạn đã nộp đơn đăng ký cho giải đấu này rồi", 400);
        }
        // 4. Prisma Transaction
        const registration = await prisma_1.default.$transaction(async (tx) => {
            const reg = await tx.registration.create({
                data: {
                    tournamentId,
                    userId,
                    teamName,
                    teamLogo,
                    status: client_1.RegistrationStatus.PENDING,
                    members: {
                        create: members.map(m => ({ memberName: m.memberName, gameId: m.gameId }))
                    }
                },
                include: { members: true }
            });
            // Notification cho người đăng ký
            await tx.notification.create({
                data: {
                    userId,
                    title: "Đăng ký thành công",
                    message: `Bạn đã nộp đơn đăng ký cho đội ${teamName} tham gia giải đấu. Vui lòng chờ duyệt.`,
                    type: "REGISTRATION_UPDATE"
                }
            });
            // Notification cho Admin (người tạo giải)
            await tx.notification.create({
                data: {
                    userId: tournament.createdById,
                    title: "Có đội mới đăng ký",
                    message: `Đội ${teamName} vừa nộp đơn đăng ký tham gia giải đấu.`,
                    type: "SYSTEM"
                }
            });
            return reg;
        });
        return registration;
    },
    async getAllRegistrations(query) {
        const { tournamentId, status, page, limit } = query;
        const parsedPage = Math.max(1, parseInt(page) || 1);
        const parsedLimit = Math.max(1, parseInt(limit) || 10);
        const skip = (parsedPage - 1) * parsedLimit;
        const take = parsedLimit;
        const where = {};
        if (tournamentId && tournamentId !== 'undefined' && tournamentId !== 'null')
            where.tournamentId = tournamentId;
        if (status && status !== 'undefined' && status !== 'null')
            where.status = status;
        const [total, data] = await Promise.all([
            prisma_1.default.registration.count({ where }),
            prisma_1.default.registration.findMany({
                where,
                skip,
                take,
                include: {
                    user: { select: { id: true, username: true, email: true } },
                    tournament: { select: { id: true, name: true, game: true } },
                    members: true
                },
                orderBy: { createdAt: "desc" },
            })
        ]);
        return { total, page: parsedPage, limit: parsedLimit, totalPages: Math.ceil(total / parsedLimit), data };
    },
    async getMyRegistrations(userId) {
        return prisma_1.default.registration.findMany({
            where: { userId },
            include: {
                tournament: { select: { id: true, name: true, game: true, status: true, startDate: true } },
                members: true
            },
            orderBy: { createdAt: "desc" }
        });
    },
    async approveRegistration(id) {
        const reg = await prisma_1.default.registration.findUnique({ where: { id }, include: { user: true, tournament: true } });
        if (!reg)
            throw new error_middleware_1.AppError("Không tìm thấy đơn đăng ký", 404);
        if (reg.status !== client_1.RegistrationStatus.PENDING)
            throw new error_middleware_1.AppError("Đơn đăng ký không ở trạng thái chờ duyệt", 400);
        const updated = await prisma_1.default.$transaction(async (tx) => {
            const updatedReg = await tx.registration.update({
                where: { id },
                data: { status: client_1.RegistrationStatus.APPROVED }
            });
            // Tạo notification
            await tx.notification.create({
                data: {
                    userId: reg.userId,
                    title: "Đơn đăng ký được duyệt",
                    message: `Đơn đăng ký đội ${reg.teamName} cho giải ${reg.tournament.name} đã được DUYỆT.`,
                    type: "REGISTRATION_UPDATE"
                }
            });
            return updatedReg;
        });
        // Gửi email không chặn transaction
        await email_service_1.emailService.sendRegistrationEmail(reg.user.email, "APPROVED");
        return updated;
    },
    async rejectRegistration(id, note) {
        if (!note)
            throw new error_middleware_1.AppError("Vui lòng cung cấp lý do từ chối (note)", 400);
        const reg = await prisma_1.default.registration.findUnique({ where: { id }, include: { user: true, tournament: true } });
        if (!reg)
            throw new error_middleware_1.AppError("Không tìm thấy đơn đăng ký", 404);
        if (reg.status !== client_1.RegistrationStatus.PENDING)
            throw new error_middleware_1.AppError("Đơn đăng ký không ở trạng thái chờ duyệt", 400);
        const updated = await prisma_1.default.$transaction(async (tx) => {
            const updatedReg = await tx.registration.update({
                where: { id },
                data: { status: client_1.RegistrationStatus.REJECTED, note }
            });
            await tx.notification.create({
                data: {
                    userId: reg.userId,
                    title: "Đơn đăng ký bị từ chối",
                    message: `Đơn đăng ký đội ${reg.teamName} cho giải ${reg.tournament.name} đã bị TỪ CHỐI. Lý do: ${note}`,
                    type: "REGISTRATION_UPDATE"
                }
            });
            return updatedReg;
        });
        await email_service_1.emailService.sendRegistrationEmail(reg.user.email, "REJECTED", note);
        return updated;
    },
    async updateSurvivalStats(id, points, kills, top1Count) {
        const reg = await prisma_1.default.registration.findUnique({ where: { id } });
        if (!reg)
            throw new error_middleware_1.AppError("Không tìm thấy đơn đăng ký", 404);
        return prisma_1.default.registration.update({
            where: { id },
            data: { survivalPoints: points, kills, top1Count }
        });
    },
    async updateRegistrationInfo(id, data) {
        const reg = await prisma_1.default.registration.findUnique({ where: { id } });
        if (!reg)
            throw new error_middleware_1.AppError("Không tìm thấy đơn đăng ký", 404);
        return prisma_1.default.$transaction(async (tx) => {
            // 1. Delete all existing members
            await tx.regMember.deleteMany({
                where: { registrationId: id }
            });
            // 2. Update registration and recreate members
            const updatedReg = await tx.registration.update({
                where: { id },
                data: {
                    teamName: data.teamName,
                    teamLogo: data.teamLogo,
                    members: {
                        create: data.members.map(m => ({ memberName: m.memberName, gameId: m.gameId }))
                    }
                },
                include: { members: true, user: true, tournament: true }
            });
            return updatedReg;
        });
    }
};
//# sourceMappingURL=registration.service.js.map