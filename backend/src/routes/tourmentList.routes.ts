import { Router } from 'express';
import { tourmentListController } from '../controllers/tourmentList.controller';

const router = Router();

// Public: list tournaments (lightweight)
router.get('/', tourmentListController.getList);

export default router;