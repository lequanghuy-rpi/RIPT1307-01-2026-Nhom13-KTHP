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
export declare const tourmentListService: {
    getList(query: any): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        data: TournamentListItem[];
    }>;
};
export {};
//# sourceMappingURL=tourmentList.server.d.ts.map