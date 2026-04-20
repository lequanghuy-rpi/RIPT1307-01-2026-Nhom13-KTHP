"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load env before importing config
dotenv_1.default.config();
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const tournament_routes_1 = __importDefault(require("./routes/tournament.routes"));
const registration_routes_1 = __importDefault(require("./routes/registration.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const export_routes_1 = __importDefault(require("./routes/export.routes"));
const tourmentList_routes_1 = __importDefault(require("./routes/tourmentList.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const match_routes_1 = __importDefault(require("./routes/match.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({ origin: env_1.config.cors.origin }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// ──────────────────────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "Esports Tournament API is running!" });
});
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        db: "Connected"
    });
});
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/tournaments", tournament_routes_1.default);
app.use("/api/registrations", registration_routes_1.default);
app.use("/api/stats", stats_routes_1.default);
app.use("/api/export", export_routes_1.default);
app.use("/api/tournament-list", tourmentList_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
app.use("/api/matches", match_routes_1.default);
// ──────────────────────────────────────────────────────────────
// Error Handling
// ──────────────────────────────────────────────────────────────
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        data: null,
        message: `Route ${req.originalUrl} không tồn tại.`,
    });
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map