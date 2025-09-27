import rateLimit from "express-rate-limit";

// ---------------- Common base configuration -----------------
const WINDOW_MS = 30 * 60 * 1000; // 30 minutes
const DEFAULT_MESSAGE = "Too many attempts, please try again after 30 minutes.";

// ---------------- Factory function to create limiters -----------------
const createLimiter = (max: number) =>
  rateLimit({
    windowMs: WINDOW_MS,
    max,
    message: DEFAULT_MESSAGE,
  });

// ---------------- Specific rate limiters -----------------
export const limiterLogin = createLimiter(20);
export const limiterRegister = createLimiter(20);
export const limiterEmail = createLimiter(10);
export const limiterUser = createLimiter(100);
export const limiterAction = createLimiter(300);
