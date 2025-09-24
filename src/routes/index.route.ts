import { Router } from "express";
import users from "./users.route.js";
import auth from "./auth.route.js";
import activities from "./activities.route.js";
import products from "./products.route.js";
import health from "./health.route.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swaggers/index.js";
import act from "./act.route.js";
import reservations from "./reservations.route.js";

export const router = Router();

// // --------------------  Swagger-------------------
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerSpec));

// --------------------  Health ------------------------
router.use("/health", health);

// --------------------  Users ------------------------
router.use("/users", users);

// --------------------  Auth ------------------------
router.use("/auth", auth);

// --------------------  Activitie ------------------------
router.use("/activities", activities);

// --------------------  Products  ----------------------
router.use("/products", products);

// --------------------  Act  ----------------------
router.use("/act", act);

// --------------------  Reservations ------------------------
//   Order 
router.use("/orders", reservations);
