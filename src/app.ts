import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";
import { errorHandler } from "./middlewares/errorhandler";
import databaseRoutes from "./routes/database.routes";
import authRoutes from "./routes/auth.routes";
import storageRoutes from "./routes/storage.routes";
import teamsRoutes from "./routes/teams.routes";
import { Permissions } from "./constants/permissions";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ============================================================================
// TEMP: Manual auth injection for local testing only.
// Uncomment to test without Module 2. Remove when integrating with upstream auth.
// ============================================================================
app.use((req, _res, next) => {
  req.auth = { permissions: [Permissions.PAYMENTS_CREATE] };
  next();
});
// ============================================================================

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Module 4 API running" });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/database", databaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/teams", teamsRoutes);

app.use(errorHandler);
export default app;
