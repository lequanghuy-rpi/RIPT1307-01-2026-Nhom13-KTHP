import { Request, Response, NextFunction } from "express";
import { exportService } from "../services/export.service";

export const exportController = {
  async exportRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      const workbook = await exportService.exportRegistrationsToExcel(req.query);
      
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=registrations.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      next(error);
    }
  }
};
