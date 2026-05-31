import { Request, Response, NextFunction } from "express";
export declare const notificationController: {
    getMy(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    broadcast(req: Request, res: Response, next: NextFunction): Promise<void>;
};
//# sourceMappingURL=notification.controller.d.ts.map