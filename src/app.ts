import express, {Router} from "express";
import healthRouter from "./routes/health.routes.js";
import tasksRouter from "./routes/tasks.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use("/api/health", healthRouter);
app.use("/api/tasks", tasksRouter);
app.use(errorHandler)

export default app;
