"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationController = void 0;
const registration_service_1 = require("../services/registration.service");
const error_middleware_1 = require("../middlewares/error.middleware");
exports.registrationController = {
    async create(req, res, next) {
        try {
            if (!req.user)
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 401);
            const result = await registration_service_1.registrationService.createRegistration(req.user.id, req.body);
            res.status(201).json({ success: true, data: result, message: "Đăng ký thành công" });
        }
        catch (error) {
            next(error);
        }
    },
    async getAll(req, res, next) {
        try {
            const result = await registration_service_1.registrationService.getAllRegistrations(req.query);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getMy(req, res, next) {
        try {
            if (!req.user)
                throw new error_middleware_1.AppError("Truy cập bị từ chối", 401);
            const result = await registration_service_1.registrationService.getMyRegistrations(req.user.id);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async approve(req, res, next) {
        try {
            const id = req.params.id;
            const result = await registration_service_1.registrationService.approveRegistration(id);
            res.json({ success: true, data: result, message: "Đã duyệt đơn đăng ký" });
        }
        catch (error) {
            next(error);
        }
    },
    async reject(req, res, next) {
        try {
            const id = req.params.id;
            const { note } = req.body;
            const result = await registration_service_1.registrationService.rejectRegistration(id, note);
            res.json({ success: true, data: result, message: "Đã từ chối đơn đăng ký" });
        }
        catch (error) {
            next(error);
        }
    },
    async updateSurvivalStats(req, res, next) {
        try {
            const id = req.params.id;
            const { points, kills, top1Count } = req.body;
            if (points === undefined || kills === undefined || top1Count === undefined) {
                throw new error_middleware_1.AppError("Vui lòng cung cấp đủ thông tin (points, kills, top1Count)", 400);
            }
            const result = await registration_service_1.registrationService.updateSurvivalStats(id, Number(points), Number(kills), Number(top1Count));
            res.json({ success: true, data: result, message: "Đã cập nhật chỉ số sinh tồn" });
        }
        catch (error) {
            next(error);
        }
    },
    async updateInfo(req, res, next) {
        try {
            const id = req.params.id;
            const { teamName, teamLogo, members } = req.body;
            if (!teamName || !members || !Array.isArray(members) || members.length === 0) {
                throw new error_middleware_1.AppError("Tên đội và danh sách thành viên không hợp lệ", 400);
            }
            const result = await registration_service_1.registrationService.updateRegistrationInfo(id, { teamName, teamLogo, members });
            res.json({ success: true, data: result, message: "Đã cập nhật thông tin đội" });
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=registration.controller.js.map