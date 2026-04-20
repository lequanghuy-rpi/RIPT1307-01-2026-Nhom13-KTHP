import prisma from "../config/prisma";
import { RegistrationStatus } from "@prisma/client";
import dayjs from "dayjs";

export const statsService = {
  async getOverview() {
    const [totalTournaments, totalRegistrations, pendingRegistrations, approvedRegistrations] = await Promise.all([
      prisma.tournament.count(),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: RegistrationStatus.PENDING } }),
      prisma.registration.count({ where: { status: RegistrationStatus.APPROVED } }),
    ]);

    return {
      totalTournaments,
      totalRegistrations,
      pendingRegistrations,
      approvedRegistrations,
    };
  },

  async getRegistrationsByDate(startDate?: string, endDate?: string) {
    let whereClause = "";
    if (startDate && endDate) {
      // Prisma raw query expects dates or strings that MySQL can parse
      whereClause = `WHERE created_at >= '${startDate}' AND created_at <= '${endDate} 23:59:59'`;
    } else {
      whereClause = `WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    }

    const data = await prisma.$queryRawUnsafe(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM registrations
      ${whereClause}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    const formattedData = (data as any[]).map(row => ({
      // Handle BigInt and format date
      date: dayjs(row.date).format('YYYY-MM-DD'),
      count: Number(row.count)
    }));

    return formattedData;
  },

  async getStatusDistribution() {
    const stats = await prisma.registration.groupBy({
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

  async getTopTournaments(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(`${endDate}T23:59:59Z`),
      };
    }

    const tournaments = await prisma.tournament.findMany({
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
