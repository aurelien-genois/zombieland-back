import type { Request, Response } from "express";
import { emailTransporter } from "./emailTransporter.service.js";

export const emailTest = async (_req: Request, res: Response) => {
  const emailTest = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_MAIL,
    subject: "✅ Test d'envoi",
    text: "Voici un e-mail envoyé depuis ton backend Node.js 🚀",
    html: "<b>Bravo ! Ceci est un test réel de <i>Zombieland/i></b>",
  };

  try {
    const info = await emailTransporter.sendMail(emailTest);
    res.send({ message: "Email envoyé avec succès !", info });
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).send({ message: "Erreur lors de l’envoi", error });
  }
};
