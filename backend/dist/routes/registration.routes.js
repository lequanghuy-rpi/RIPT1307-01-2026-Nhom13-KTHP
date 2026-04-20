"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("../controllers/registration.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// User routes
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("USER"), registration_controller_1.registrationController.create);
router.get("/my", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("USER"), registration_controller_1.registrationController.getMy);
// Admin routes
router.get("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), registration_controller_1.registrationController.getAll);
router.patch("/:id/approve", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), registration_controller_1.registrationController.approve);
router.patch("/:id/reject", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), registration_controller_1.registrationController.reject);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), registration_controller_1.registrationController.updateInfo);
router.patch("/:id/survival-stats", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), registration_controller_1.registrationController.updateSurvivalStats);
exports.default = router;
//# sourceMappingURL=registration.routes.js.map