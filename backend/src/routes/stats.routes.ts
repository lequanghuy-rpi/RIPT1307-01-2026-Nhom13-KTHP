import { Router } from "express";
import { statsController } from "../controllers/stats.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Phân quyền cho tất cả các route trong stats
router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/overview", statsController.getOverview);
router.get("/registrations-by-date", statsController.getRegistrationsByDate);
router.get("/status-distribution", statsController.getStatusDistribution);
router.get("/top-tournaments", statsController.getTopTournaments);

export default router;
