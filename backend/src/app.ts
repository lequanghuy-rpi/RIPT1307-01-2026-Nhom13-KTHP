import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import dotenv from "dotenv";

// Load env before importing config
dotenv.config();

import { config } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import tournamentRoutes from "./routes/tournament.routes";
import registrationRoutes from "./routes/registration.routes";
import statsRoutes from "./routes/stats.routes";
import exportRoutes from "./routes/export.routes";

import notificationRoutes from "./routes/notification.routes";
import matchRoutes from "./routes/match.routes";

const app = express();


// Middlewares

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: config.cors.origin }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ──────────────────────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────────────────────
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Esports Tournament API is running!" });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    db: "Connected" 
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/export", exportRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/matches", matchRoutes);

// ──────────────────────────────────────────────────────────────
// Error Handling
// ──────────────────────────────────────────────────────────────

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Route ${req.originalUrl} không tồn tại.`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
