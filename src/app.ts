import "dotenv/config";
import cors from "cors";
import express from "express";
import { router } from "./routes/index.route.js";
import bodyParser from "body-parser";
import { config } from "./configs/server.config.js";

const PORT = config.server.port;
const app = express();

app.use(cors({ origin: config.server.allowedOrigins }));

app.use(express.json());

app.use(bodyParser.json());

app.use("/api", router);

app.get("/", (_req, res) => res.send("HOME PAGE !!!"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
