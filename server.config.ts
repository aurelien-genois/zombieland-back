import "dotenv/config";
export const config = {
  server: {
    port: parseInt(process.env.PORT || "3000"),
    allowedOrigins: process.env.ALLOWED_ORIGINS || "*",
    jwtSecret: process.env.JWT_SECRET || "jwt-secret",
    secure: process.env.NODE_ENV === "production" || false,
    logLevel: process.env.LOG_LEVEL || "info",
    portLogHttp: parseInt(process.env.LOGSTASH_PORT || "3030"),
    frontUrl: process.env.FRONT_URL || "http://localhost:5173",
    // logService: process.env.LOG_HTTP_HOST || "localhost",
  },
};
