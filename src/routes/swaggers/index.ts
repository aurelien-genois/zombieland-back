import swaggerJSDoc from "swagger-jsdoc";
import { config } from "../../configs/server.config.js";

const PORT = config.server.port;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zombieland API",
      version: "1.0.0",
      description: `Documentation de l'API Zombieland.\n\nℹ️ Pour la vérification d'e-mail,
        cette API envoie des liens via un service SMTP local
        (ex : Mailpit sur http://localhost:8026).\n\n⚠️
         Cette API utilise des tokens JWT stockés dans des cookies pour l'authentification.
         Vous devez installer et connecter la base de données
         pour que l'authentification fonctionne correctement.\n\n🚀 Pour initialiser l'API avec Docker,
          suivez les commandes docker dans le README.md`,
    },
    servers: [
      {
        url: `http://localhost:3020`,
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Vérification de l'état de l'API",
      },
      {
        name: "Auth",
        description: "Authentification des utilisateurs",
      },
      {
        name: "Users",
        description: "Gestion des utilisateurs",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/routes/swaggers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
