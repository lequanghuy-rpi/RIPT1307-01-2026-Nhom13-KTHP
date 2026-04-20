"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("@prisma/client");
const dayjs_1 = __importDefault(require("dayjs"));
exports.statsService = {
    async getOverview() {
        const [totalTournaments, totalRegistrations, pendingRegistrations, approvedRegistrations] = await Promise.all([
            prisma_1.default.tournament.count(),
            prisma_1.default.registration.count(),
            prisma_1.default.registration.count({ where: { status: client_1.RegistrationStatus.PENDING } }),
            prisma_1.default.registration.count({ where: { status: client_1.RegistrationStatus.APPROVED } }),
        ]);
        return {
            totalTournaments,
            totalRegistrations,
            pendingRegistrations,
            approvedRegistrations,
        };
    },
    async getRegistrationsByDate(startDate, endDate) {
        let whereClause = "";
        if (startDate && endDate) {
            // Prisma raw query expects dates or strings that MySQL can parse
            whereClause = `WHERE created_at >= '${startDate}' AND created_at <= '${endDate} 23:59:59'`;
        }
        else {
            whereClause = `WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
        }
        const data = await prisma_1.default.$queryRawUnsafe(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM registrations
      ${whereClause}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
        const formattedData = data.map(row => ({
            // Handle BigInt and format date
            date: (0, dayjs_1.default)(row.date).format('YYYY-MM-DD'),
            count: Number(row.count)
        }));
        return formattedData;
    },
    async getStatusDistribution() {
        const stats = await prisma_1.default.registration.groupBy({
            by: ['status'],
            _count: {
                _all: true,
            },
        });
        return stats.map(s => ({
            status: s.status,
            count: s._count._all,
        }));
    },
    async getTopTournaments(startDate, endDate) {
        const where = {};
        if (startDate && endDate) {
            where.createdAt = {
                gte: new Date(startDate),
                lte: new Date(`${endDate}T23:59:59Z`),
            };
        }
        const tournaments = await prisma_1.default.tournament.findMany({
            where,
            include: {
                _count: {
                    select: { registrations: true },
                },
                registrations: {
                    select: { status: true }
                }
            },
        });
        const formatted = tournaments.map(t => {
            const total = t._count.registrations;
            const approved = t.registrations.filter(r => r.status === 'APPROVED').length;
            return {
                id: t.id,
                name: t.name,
                game: t.game,
                total,
                approved,
                rate: t.maxTeams > 0 ? Math.round((approved / t.maxTeams) * 100) : 0,
            };
        });
        // Sort by total descending and take top 10
        return formatted.sort((a, b) => b.total - a.total).slice(0, 10);
    }
};
//# sourceMappingURL=stats.service.js.map