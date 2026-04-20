"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsController = void 0;
const stats_service_1 = require("../services/stats.service");
exports.statsController = {
    async getOverview(req, res, next) {
        try {
            const result = await stats_service_1.statsService.getOverview();
            // Send directly without data wrapper because user expects { totalTournaments, ... } directly
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    },
    async getRegistrationsByDate(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const result = await stats_service_1.statsService.getRegistrationsByDate(startDate, endDate);
            res.json({ data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getStatusDistribution(req, res, next) {
        try {
            const result = await stats_service_1.statsService.getStatusDistribution();
            res.json({ data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getTopTournaments(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const result = await stats_service_1.statsService.getTopTournaments(startDate, endDate);
            res.json({ data: result });
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=stats.controller.js.map