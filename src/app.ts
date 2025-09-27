import "dotenv/config";
import debug from "debug";
import cors from "cors";
import express from "express";
import { router } from "./routes/index.route.js";
import bodyParser from "body-parser";
import { config } from "./configs/server.config.js";
import { helmetMiddlewre } from "./middlewares/helmet.middleware.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/global-error-handler.js";
import { logger } from "./lib/logger.js";
import { loggerMiddleware } from "./middlewares/request-logger.middleware.js";

const PORT = config.server.port;
const app = express();

app.use(cors({ origin: config.server.allowedOrigins, credentials: true }));

app.use(express.json());

app.use(helmetMiddlewre);

app.use(bodyParser.json());

app.use(cookieParser());

app.use(morgan("dev"));
app.use(loggerMiddleware);

app.use("/api", router);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  logger.info(`🚀 Server running on port ${PORT}`);
});
