"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportController = void 0;
const export_service_1 = require("../services/export.service");
exports.exportController = {
    async exportRegistrations(req, res, next) {
        try {
            const workbook = await export_service_1.exportService.exportRegistrationsToExcel(req.query);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", "attachment; filename=registrations.xlsx");
            await workbook.xlsx.write(res);
            res.end();
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=export.controller.js.map