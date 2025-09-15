import "dotenv/config";
import express from "express";
import { router } from "./routes/index.route.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
