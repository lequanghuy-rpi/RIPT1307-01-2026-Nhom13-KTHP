"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tournament_controller_1 = require("../controllers/tournament.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", tournament_controller_1.tournamentController.getAll);
router.get("/:id", tournament_controller_1.tournamentController.getById);
// Admin routes
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), tournament_controller_1.tournamentController.create);
router.put("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), tournament_controller_1.tournamentController.update);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"), tournament_controller_1.tournamentController.delete);
exports.default = router;
//# sourceMappingURL=tournament.routes.js.map