"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourmentListController = void 0;
const tourmentList_server_1 = require("../services/tourmentList.server");
exports.tourmentListController = {
    async getList(req, res, next) {
        try {
            const result = await tourmentList_server_1.tourmentListService.getList(req.query);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=tourmentList.controller.js.map