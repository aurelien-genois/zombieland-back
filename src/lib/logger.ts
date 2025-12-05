import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../../server.config.js";

export const logger = createLogger(
  // options
  {
    level: config.server.logLevel,
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.json()
    ),
    defaultMeta: { service: "zombieland-api" },
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
      new DailyRotateFile({
        level: "error",
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new DailyRotateFile({
        level: "http",
        filename: "logs/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
      }),
      new transports.Http({
        level: "http",
        // host: config.server.logService,
        host: "localhost",
        port: config.server.portLogHttp,
        path: "/api/logs",
      }),
    ],
  }
);
