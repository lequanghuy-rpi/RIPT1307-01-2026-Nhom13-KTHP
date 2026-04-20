import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
export declare const roleMiddleware: (role: Role) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=role.middleware.d.ts.map