"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentController = void 0;
const tournament_service_1 = require("../services/tournament.service");
const error_middleware_1 = require("../middlewares/error.middleware");
exports.tournamentController = {
    async getAll(req, res, next) {
        try {
            const result = await tournament_service_1.tournamentService.getAllTournaments(req.query);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const id = req.params.id;
            const tournament = await tournament_service_1.tournamentService.getTournamentById(id);
            res.json({ success: true, data: tournament });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            if (!req.user || req.user.role !== "ADMIN") {
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 403);
            }
            const data = req.body;
            data.startDate = new Date(data.startDate);
            data.endDate = new Date(data.endDate);
            if (data.maxTeams) {
                data.maxTeams = Number(data.maxTeams);
            }
            const newTournament = await tournament_service_1.tournamentService.createTournament(data, req.user.id);
            res.status(201).json({ success: true, data: newTournament, message: "Tạo giải đấu thành công" });
        }
        catch (error) {
            console.error("CREATE TOURNAMENT ERROR:", error);
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            if (data.startDate)
                data.startDate = new Date(data.startDate);
            if (data.endDate)
                data.endDate = new Date(data.endDate);
            const updated = await tournament_service_1.tournamentService.updateTournament(id, data);
            res.json({ success: true, data: updated, message: "Cập nhật giải đấu thành công" });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            const result = await tournament_service_1.tournamentService.deleteTournament(id);
            res.json({ success: true, message: result.message });
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=tournament.controller.js.map