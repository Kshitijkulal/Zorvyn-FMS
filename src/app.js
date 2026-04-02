import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

import { apiLimiter } from "./middlewares/rateLimit.middleware.js"


const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api", apiLimiter)
app.use(`/api`,routes);

app.use(errorMiddleware)

export default app;


