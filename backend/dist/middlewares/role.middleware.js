"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Chưa xác thực. Vui lòng đăng nhập." });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ message: `Truy cập bị từ chối. Yêu cầu quyền: ${role}.` });
            return;
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=role.middleware.js.map