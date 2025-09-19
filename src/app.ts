import "dotenv/config";
import debug from "debug";
const log = debug("zombieland:server");
import cors from "cors";
import express from "express";
import { router } from "./routes/index.route.js";
import bodyParser from "body-parser";
import { config } from "./configs/server.config.js";
import { helmetMiddlewre } from "./middlewares/helmet.middleware.js";
import morgan from "morgan";

const PORT = config.server.port;
const app = express();

app.use(cors({ origin: config.server.allowedOrigins }));

app.use(express.json());

app.use(helmetMiddlewre);

app.use(bodyParser.json());

app.use(morgan("dev"));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  log(`🚀 Server running on port ${PORT}`);
});
