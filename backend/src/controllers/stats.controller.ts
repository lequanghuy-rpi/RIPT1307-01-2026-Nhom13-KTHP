import { Request, Response, NextFunction } from "express";
import { statsService } from "../services/stats.service";

export const statsController = {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await statsService.getOverview();
      // Send directly without data wrapper because user expects { totalTournaments, ... } directly
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getRegistrationsByDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const result = await statsService.getRegistrationsByDate(startDate as string, endDate as string);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async getStatusDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await statsService.getStatusDistribution();
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  },

  async getTopTournaments(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      const result = await statsService.getTopTournaments(startDate as string, endDate as string);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
};
