"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.authController.register);
router.post("/login", auth_controller_1.authController.login);
router.get("/me", auth_middleware_1.authMiddleware, auth_controller_1.authController.getMe);
router.get("/me/stats", auth_middleware_1.authMiddleware, auth_controller_1.authController.getStats);
router.put("/me/avatar", auth_middleware_1.authMiddleware, auth_controller_1.authController.updateAvatar);
router.delete("/me/avatar", auth_middleware_1.authMiddleware, auth_controller_1.authController.removeAvatar);
router.put("/me/password", auth_middleware_1.authMiddleware, auth_controller_1.authController.changePassword);
router.delete("/me", auth_middleware_1.authMiddleware, auth_controller_1.authController.deleteAccount);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map