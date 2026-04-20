import { Router } from "express";
import { exportController } from "../controllers/export.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Phân quyền cho tất cả các route trong export
router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/registrations", exportController.exportRegistrations);

export default router;
