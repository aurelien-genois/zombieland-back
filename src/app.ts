import "dotenv/config";
import cors from "cors";
import express from "express";
import { router } from "./routes/index.route.js";
import { config } from "../server.config.js";
import { helmetMiddleware } from "./middlewares/helmet.middleware.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/global-error-handler.js";
import { loggerMiddleware } from "./middlewares/request-logger.middleware.js";
import bodySanitizer from "./middlewares/body-sanitizer.middleware.js";
import { stripeIPNRouter } from "./routes/utils/stripe_ipn.route.js";

// Créer une app Express
export const app = express();

app.use(cors({ origin: config.server.allowedOrigins, credentials: true }));

// Security headers first
app.use(helmetMiddleware);

// stripe payment before body parsing
app.use("/api/orders/payment/stripe", stripeIPNRouter);
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sanitize request bodies
app.use(bodySanitizer);

// Cookies & logs
app.use(cookieParser());
app.use(morgan("dev"));
app.use(loggerMiddleware);

// Routes
app.use("/api", router);

// Error handler
app.use(globalErrorHandler);
