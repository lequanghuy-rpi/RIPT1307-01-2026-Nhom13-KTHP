import { Request, Response, NextFunction } from "express";
export declare const statsController: {
    getOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRegistrationsByDate(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStatusDistribution(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTopTournaments(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=stats.controller.d.ts.map