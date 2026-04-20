import { Router } from "express";
import { tournamentController } from "../controllers/tournament.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Public routes
router.get("/", tournamentController.getAll);
router.get("/:id", tournamentController.getById);

// Admin routes
router.post("/", authMiddleware, roleMiddleware("ADMIN"), tournamentController.create);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), tournamentController.update);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), tournamentController.delete);

export default router;
