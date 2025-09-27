import winston from "winston";
import { config } from "../configs/server.config.js";
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: config.server.logLevel || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), json()),
  transports: [new winston.transports.Console()],
});

export default logger;
