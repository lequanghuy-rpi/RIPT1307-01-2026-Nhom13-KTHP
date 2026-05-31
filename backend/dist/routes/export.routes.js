"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const export_controller_1 = require("../controllers/export.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
// Phân quyền cho tất cả các route trong export
router.use(auth_middleware_1.authMiddleware, (0, role_middleware_1.roleMiddleware)("ADMIN"));
router.get("/registrations", export_controller_1.exportController.exportRegistrations);
exports.default = router;
//# sourceMappingURL=export.routes.js.map