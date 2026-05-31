"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tourmentList_controller_1 = require("../controllers/tourmentList.controller");
const router = (0, express_1.Router)();
// Public: list tournaments (lightweight)
router.get('/', tourmentList_controller_1.tourmentListController.getList);
exports.default = router;
//# sourceMappingURL=tourmentList.routes.js.map