import type { Request, Response, NextFunction } from "express";
import sanitize from "sanitize-html";

const bodySanitizer = (req: Request, _res: Response, next: NextFunction) => {
  // Sanitize each string field in the request body
  if (req.body) {
    const keys = Object.keys(req.body);
    for (const key of keys) {
      req.body[key] =
        typeof req.body[key] === "string"
          ? sanitize(req.body[key])
          : req.body[key];
    }
  }
  next();
};

export default bodySanitizer;
