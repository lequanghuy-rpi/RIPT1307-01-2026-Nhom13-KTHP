"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const error_middleware_1 = require("../middlewares/error.middleware");
const client_1 = require("@prisma/client");
exports.tournamentService = {
    async getAllTournaments(query) {
        const { game, status, search, page = 1, limit = 10 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const where = {};
        if (game)
            where.game = game;
        if (status)
            where.status = status;
        if (search) {
            where.name = { contains: search };
        }
        const [total, data] = await Promise.all([
            prisma_1.default.tournament.count({ where }),
            prisma_1.default.tournament.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    _count: {
                        select: {
                            registrations: {
                                where: { status: "APPROVED" }
                            }
                        }
                    }
                }
            })
        ]);
        return {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            data
        };
    },
    async getTournamentById(id) {
        const tournament = await prisma_1.default.tournament.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { id: true, username: true, email: true, avatar: true }
                },
                _count: {
                    select: {
                        registrations: {
                            where: { status: client_1.RegistrationStatus.APPROVED }
                        }
                    }
                },
                registrations: {
                    where: { status: client_1.RegistrationStatus.APPROVED },
                    include: {
                        members: true,
                        user: {
                            select: {
                                username: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
        if (!tournament) {
            throw new error_middleware_1.AppError("Không tìm thấy giải đấu", 404);
        }
        return tournament;
    },
    async createTournament(data, adminId) {
        return prisma_1.default.tournament.create({
            data: {
                ...data,
                createdById: adminId,
                status: client_1.TournamentStatus.UPCOMING
            }
        });
    },
    async updateTournament(id, data) {
        const existing = await prisma_1.default.tournament.findUnique({ where: { id } });
        if (!existing)
            throw new error_middleware_1.AppError("Không tìm thấy giải đấu", 404);
        return prisma_1.default.tournament.update({
            where: { id },
            data
        });
    },
    async deleteTournament(id) {
        const existing = await prisma_1.default.tournament.findUnique({
            where: { id },
            include: {
                registrations: {
                    where: { status: client_1.RegistrationStatus.APPROVED }
                }
            }
        });
        if (!existing)
            throw new error_middleware_1.AppError("Không tìm thấy giải đấu", 404);
        if (existing.registrations.length > 0 && existing.status !== client_1.TournamentStatus.FINISHED) {
            throw new error_middleware_1.AppError("Không thể xóa giải đấu đang hoạt động đã có đội được duyệt. Chỉ có thể xóa giải đấu đã KẾT THÚC.", 400);
        }
        // Xóa tất cả dữ liệu liên quan (matches, regMembers, registrations)
        await prisma_1.default.$transaction([
            prisma_1.default.match.deleteMany({
                where: { tournamentId: id }
            }),
            prisma_1.default.regMember.deleteMany({
                where: { registration: { tournamentId: id } }
            }),
            prisma_1.default.registration.deleteMany({
                where: { tournamentId: id }
            }),
            prisma_1.default.tournament.delete({
                where: { id }
            })
        ]);
        return { message: "Xóa giải đấu thành công" };
    }
};
//# sourceMappingURL=tournament.service.js.map