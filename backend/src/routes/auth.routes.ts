import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.get("/me/stats", authMiddleware, authController.getStats);
router.put("/me/avatar", authMiddleware, authController.updateAvatar);
router.delete("/me/avatar", authMiddleware, authController.removeAvatar);
router.put("/me/password", authMiddleware, authController.changePassword);
router.delete("/me", authMiddleware, authController.deleteAccount);

export default router;
