"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get("/my", notification_controller_1.notificationController.getMy);
router.get("/unread-count", notification_controller_1.notificationController.getUnreadCount);
router.patch("/:id/read", notification_controller_1.notificationController.markAsRead);
router.patch("/read-all", notification_controller_1.notificationController.markAllAsRead);
router.post("/broadcast", notification_controller_1.notificationController.broadcast);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map