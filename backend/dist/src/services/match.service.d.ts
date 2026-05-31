export declare const getMatchesByTournament: (tournamentId: string) => Promise<({
    team1: {
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
    } | null;
    team2: {
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
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    tournamentId: string;
    team1Id: string | null;
    team2Id: string | null;
    team1Score: number | null;
    team2Score: number | null;
    startTime: Date | null;
    round: string | null;
    evidenceImage: string | null;
})[]>;
export declare const createMatch: (data: {
    tournamentId: string;
    team1Id: string;
    team2Id: string;
    round?: string;
    startTime?: Date;
}) => Promise<{
    team1: {
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
    } | null;
    team2: {
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
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    tournamentId: string;
    team1Id: string | null;
    team2Id: string | null;
    team1Score: number | null;
    team2Score: number | null;
    startTime: Date | null;
    round: string | null;
    evidenceImage: string | null;
}>;
export declare const updateMatchScore: (id: string, data: {
    team1Score?: number;
    team2Score?: number;
    status?: string;
}) => Promise<{
    team1: {
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
    } | null;
    team2: {
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
    } | null;
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    tournamentId: string;
    team1Id: string | null;
    team2Id: string | null;
    team1Score: number | null;
    team2Score: number | null;
    startTime: Date | null;
    round: string | null;
    evidenceImage: string | null;
}>;
export declare const deleteMatch: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    tournamentId: string;
    team1Id: string | null;
    team2Id: string | null;
    team1Score: number | null;
    team2Score: number | null;
    startTime: Date | null;
    round: string | null;
    evidenceImage: string | null;
}>;
export declare const uploadEvidence: (id: string, userId: string, evidenceImage: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    tournamentId: string;
    team1Id: string | null;
    team2Id: string | null;
    team1Score: number | null;
    team2Score: number | null;
    startTime: Date | null;
    round: string | null;
    evidenceImage: string | null;
}>;
//# sourceMappingURL=match.service.d.ts.map