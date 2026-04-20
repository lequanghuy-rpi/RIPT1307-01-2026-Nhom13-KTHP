import { Request, Response, NextFunction } from 'express';
import { tourmentListService } from '../services/tourmentList.server';

export const tourmentListController = {
	async getList(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await tourmentListService.getList(req.query);
			res.json({ success: true, data: result });
		} catch (error) {
			next(error);
		}
	}
};
