import { Request, Response, NextFunction } from "express";
export declare const registrationController: {
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMy(req: Request, res: Response, next: NextFunction): Promise<void>;
    approve(req: Request, res: Response, next: NextFunction): Promise<void>;
    reject(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateSurvivalStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=registration.controller.d.ts.map