"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourmentListService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
exports.tourmentListService = {
    async getList(query) {
        const { game, status, search, page = 1, limit = 10 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const where = {};
        if (game)
            where.game = game;
        if (status)
            where.status = status;
        if (search)
            where.name = { contains: search };
        const [total, items] = await Promise.all([
            prisma_1.default.tournament.count({ where }),
            prisma_1.default.tournament.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    game: true,
                    status: true,
                    startDate: true,
                    endDate: true,
                    banner: true,
                    maxTeams: true,
                    _count: { select: { registrations: true } }
                }
            })
        ]);
        const data = items.map(i => ({
            id: i.id,
            name: i.name,
            game: i.game,
            status: i.status,
            startDate: i.startDate,
            endDate: i.endDate,
            banner: i.banner,
            maxTeams: i.maxTeams,
            registered: i._count?.registrations ?? 0
        }));
        return {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
            data
        };
    }
};
//# sourceMappingURL=tourmentList.server.js.map