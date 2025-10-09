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
    backUrl: process.env.BACK_URL || "http://localhost:3000",
    // logService: process.env.LOG_HTTP_HOST || "localhost",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
    adminEmail: process.env.ADMIN_EMAIL || "",
    adminPassword: process.env.ADMIN_PASSWORD || "",
    adminEmailB: process.env.ADMIN_EMAIL_B || "",
    adminPasswordB: process.env.ADMIN_PASSWORD_B || "",
    adminEmailC: process.env.ADMIN_EMAIL_C || "",
    adminPasswordC: process.env.ADMIN_PASSWORD_C || "",
    adminEmailD: process.env.ADMIN_EMAIL_D || "",
    adminPasswordD: process.env.ADMIN_PASSWORD_D || "",
  },
};
