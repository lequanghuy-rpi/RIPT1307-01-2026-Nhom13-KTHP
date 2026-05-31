"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Phân quyền cho tất cả các route trong stats
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"));
router.get("/overview", stats_controller_1.statsController.getOverview);
router.get("/registrations-by-date", stats_controller_1.statsController.getRegistrationsByDate);
router.get("/status-distribution", stats_controller_1.statsController.getStatusDistribution);
router.get("/top-tournaments", stats_controller_1.statsController.getTopTournaments);
exports.default = router;
//# sourceMappingURL=stats.routes.js.map