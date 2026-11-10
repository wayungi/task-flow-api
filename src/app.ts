import express, {Router} from "express";
import healthRouter from "./routes/health.routes.js";
import tasksRouter from "./routes/tasks.routes.js";

const app = express();
const router = Router();

app.use(express.json());
app.use("/api", router);

router.use("/health", healthRouter);
router.use("/tasks", tasksRouter);


export default app;
