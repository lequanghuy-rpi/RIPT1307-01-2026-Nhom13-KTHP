import { Request, Response } from 'express';
export declare const getMatchesByTournament: (req: Request, res: Response) => Promise<void>;
export declare const createMatch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMatchScore: (req: Request, res: Response) => Promise<void>;
export declare const deleteMatch: (req: Request, res: Response) => Promise<void>;
export declare const uploadEvidence: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=match.controller.d.ts.map