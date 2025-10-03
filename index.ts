import { config } from "./server.config.js";
import { app } from "./src/app.js";
import { logger } from "./src/lib/logger.js";

// Démarre un serveur
const port = config.server.port;
app.listen(port, () => {
  logger.info(`🚀 Server started at http://localhost:${port}`);
});
