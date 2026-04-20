export declare const statsService: {
    getOverview(): Promise<{
        totalTournaments: number;
        totalRegistrations: number;
        pendingRegistrations: number;
        approvedRegistrations: number;
    }>;
    getRegistrationsByDate(startDate?: string, endDate?: string): Promise<{
        date: string;
        count: number;
    }[]>;
    getStatusDistribution(): Promise<{
        status: import("@prisma/client").$Enums.RegistrationStatus;
        count: number;
    }[]>;
    getTopTournaments(startDate?: string, endDate?: string): Promise<{
        id: string;
        name: string;
        game: string;
        total: number;
        approved: number;
        rate: number;
    }[]>;
};
//# sourceMappingURL=stats.service.d.ts.map