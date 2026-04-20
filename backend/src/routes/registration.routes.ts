import { Router } from "express";
import { registrationController } from "../controllers/registration.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// User routes
router.post("/", authMiddleware, roleMiddleware("USER"), registrationController.create);
router.get("/my", authMiddleware, roleMiddleware("USER"), registrationController.getMy);

// Admin routes
router.get("/", authMiddleware, roleMiddleware("ADMIN"), registrationController.getAll);
router.patch("/:id/approve", authMiddleware, roleMiddleware("ADMIN"), registrationController.approve);
router.patch("/:id/reject", authMiddleware, roleMiddleware("ADMIN"), registrationController.reject);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), registrationController.updateInfo);
router.patch("/:id/survival-stats", authMiddleware, roleMiddleware("ADMIN"), registrationController.updateSurvivalStats);

export default router;
