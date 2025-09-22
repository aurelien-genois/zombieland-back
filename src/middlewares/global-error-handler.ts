import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { HttpClientError } from "../lib/errors.js";

export function globalErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseError = {
    error: "An error occurred",
    stack: isProduction ? undefined : error.stack,
  };

  console.error("An error occurred:", error);

  if (error instanceof z.ZodError) {
    res.status(400).json({
      ...baseError,
      status: 400,
      error: error.issues[0].message,
    });
    return;
  }

  if (error instanceof HttpClientError) {
    res.status(error.status).json({
      ...baseError,
      status: error.status,
      error: error.message,
    });
    return;
  }

  res.status(500).json({
    ...baseError,
    status: 500,
  });
  return;
}
