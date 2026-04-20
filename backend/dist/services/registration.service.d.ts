interface MemberInput {
    memberName: string;
    gameId: string;
}
interface CreateRegistrationDto {
    tournamentId: string;
    teamName: string;
    teamLogo?: string;
    members: MemberInput[];
}
export declare const registrationService: {
    createRegistration(userId: string, data: CreateRegistrationDto): Promise<{
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
    }>;
    getAllRegistrations(query: any): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        data: ({
            user: {
                id: string;
                username: string;
                email: string;
            };
            tournament: {
                name: string;
                id: string;
                game: string;
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
    }>;
    getMyRegistrations(userId: string): Promise<({
        tournament: {
            name: string;
            id: string;
            game: string;
            startDate: Date;
            status: import("@prisma/client").$Enums.TournamentStatus;
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
    })[]>;
    approveRegistration(id: string): Promise<{
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
    }>;
    rejectRegistration(id: string, note: string): Promise<{
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
    }>;
    updateSurvivalStats(id: string, points: number, kills: number, top1Count: number): Promise<{
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
    }>;
    updateRegistrationInfo(id: string, data: {
        teamName: string;
        teamLogo?: string;
        members: {
            memberName: string;
            gameId: string;
        }[];
    }): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        tournament: {
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
    }>;
};
export {};
//# sourceMappingURL=registration.service.d.ts.map