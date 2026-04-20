import { TournamentStatus, TournamentFormat } from "@prisma/client";
interface CreateTournamentDto {
    name: string;
    game: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    maxTeams: number;
    banner?: string;
    format?: TournamentFormat;
    prizePool?: string;
}
interface UpdateTournamentDto extends Partial<CreateTournamentDto> {
    status?: TournamentStatus;
    format?: TournamentFormat;
}
export declare const tournamentService: {
    getAllTournaments(query: any): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        data: ({
            _count: {
                registrations: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            game: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            maxTeams: number;
            prizePool: string | null;
            status: import("@prisma/client").$Enums.TournamentStatus;
            format: import("@prisma/client").$Enums.TournamentFormat;
            banner: string | null;
            createdById: string;
        })[];
    }>;
    getTournamentById(id: string): Promise<{
        createdBy: {
            id: string;
            username: string;
            email: string;
            avatar: string | null;
        };
        registrations: ({
            user: {
                username: string;
                email: string;
            };
            members: {
                id: string;
                registrationId: string;
                memberName: string;
                gameId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            tournamentId: string;
            userId: string;
            teamName: string;
            teamLogo: string | null;
            note: string | null;
            survivalPoints: number;
            kills: number;
            top1Count: number;
        })[];
        _count: {
            registrations: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        game: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        maxTeams: number;
        prizePool: string | null;
        status: import("@prisma/client").$Enums.TournamentStatus;
        format: import("@prisma/client").$Enums.TournamentFormat;
        banner: string | null;
        createdById: string;
    }>;
    createTournament(data: CreateTournamentDto, adminId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        game: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        maxTeams: number;
        prizePool: string | null;
        status: import("@prisma/client").$Enums.TournamentStatus;
        format: import("@prisma/client").$Enums.TournamentFormat;
        banner: string | null;
        createdById: string;
    }>;
    updateTournament(id: string, data: UpdateTournamentDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        game: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        maxTeams: number;
        prizePool: string | null;
        status: import("@prisma/client").$Enums.TournamentStatus;
        format: import("@prisma/client").$Enums.TournamentFormat;
        banner: string | null;
        createdById: string;
    }>;
    deleteTournament(id: string): Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=tournament.service.d.ts.map