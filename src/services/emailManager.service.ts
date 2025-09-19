import type { Request, Response } from "express";
import { emailTransporter } from "./emailTransporter.service.js";

export const emailTest = async (_req: Request, res: Response) => {
  const emailTest = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_MAIL,
    subject: "✅ Test d'envoi",
    text: "Voici un e-mail envoyé depuis ton backend Node.js 🚀",
    html: "<b>Bravo ! Ceci est un test réel de <i>Zombieland</i></b>",
  };

  try {
    const info = await emailTransporter.sendMail(emailTest);
    res.send({ message: "Email envoyé avec succès !", info });
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).send({ message: "Erreur lors de l’envoi", error });
  }
};

export const sendVerificationEmail = async (
  toEmail: string,
  verificationCode: string
) => {
  const emailVerification = {
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: "✅ Vérification de votre adresse e-mail",
    text: `Votre code de vérification est : ${verificationCode}`,
    html: `<p>Votre code de vérification est : 
   <a href="http://localhost:3020/api/auth/email-confirmation?token=${verificationCode}">Cliquer ici</a></p>`,
  };

  return await emailTransporter.sendMail(emailVerification);
};
