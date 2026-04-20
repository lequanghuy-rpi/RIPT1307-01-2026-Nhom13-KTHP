import prisma from '../config/prisma';
import { TournamentStatus } from '@prisma/client';

interface TournamentListItem {
    id: string;
    name: string;
    game: string;
    status: TournamentStatus;
    startDate: Date;
    endDate: Date;
    banner?: string | null;
    maxTeams: number;
    registered: number;
}

export const tourmentListService = {
    async getList(query: any) {
        const { game, status, search, page = 1, limit = 10 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const where: any = {};
        if (game) where.game = game;
        if (status) where.status = status as TournamentStatus;
        if (search) where.name = { contains: search };

        const [total, items] = await Promise.all([
            prisma.tournament.count({ where }),
            prisma.tournament.findMany({
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

        const data: TournamentListItem[] = items.map(i => ({
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