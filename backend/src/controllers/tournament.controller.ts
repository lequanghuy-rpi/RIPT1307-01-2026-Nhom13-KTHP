import { Request, Response, NextFunction } from "express";
import { tournamentService } from "../services/tournament.service";
import { AppError } from "../middlewares/error.middleware";

export const tournamentController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await tournamentService.getAllTournaments(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const tournament = await tournamentService.getTournamentById(id);
      res.json({ success: true, data: tournament });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== "ADMIN") {
        throw new AppError("Truy cập bị từ chối", 403);
      }
      const data = req.body;
      data.startDate = new Date(data.startDate);
      data.endDate = new Date(data.endDate);
      if (data.maxTeams) {
        data.maxTeams = Number(data.maxTeams);
      }
      
      const newTournament = await tournamentService.createTournament(data, req.user.id);
      res.status(201).json({ success: true, data: newTournament, message: "Tạo giải đấu thành công" });
    } catch (error: any) {
      console.error("CREATE TOURNAMENT ERROR:", error);
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const data = req.body;
      if (data.startDate) data.startDate = new Date(data.startDate);
      if (data.endDate) data.endDate = new Date(data.endDate);
      
      const updated = await tournamentService.updateTournament(id, data);
      res.json({ success: true, data: updated, message: "Cập nhật giải đấu thành công" });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await tournamentService.deleteTournament(id);
      res.json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  }
};
