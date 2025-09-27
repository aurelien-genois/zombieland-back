import morgan from "morgan";
import { logger } from "../lib/logger.js";

// Morgan va me permettre de récupérer les informations des requêtes HTTP
// Je vais les transmettre à mon logger
export const loggerMiddleware = morgan(
  // tokens est un objet contenant les informations générées par Morgan
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status_code: Number.parseFloat(tokens.status(req, res) || "0"),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(
        tokens["response-time"](req, res) || "0"
      ),
      user_agent: tokens["user-agent"](req, res),
      ip: "ip" in req ? req.ip : req.socket.remoteAddress,
      userId: "userId" in req ? req.userId : undefined,
      userRole: "userRole" in req ? req.userRole : undefined,
    });
  },
  {
    stream: {
      // On transmet les logs à Winston
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  }
);
