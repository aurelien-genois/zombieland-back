import type { Request, Response } from "express";
import { emailTransporter } from "./emailTransporter.service.js";

// -------------------- Email Test ------------------------

export const emailTest = async (_req: Request, res: Response) => {
  const emailTest = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_MAIL,
    subject: "✅ Test d'envoi",
    text: "Voici un e-mail envoyé depuis ton backend Node.js 🚀",
    html: "<b>Bravo ! Ceci est un test réel de <i>Zombieland</i></b>",
  };

  const info = await emailTransporter.sendMail(emailTest);
  res.send({ message: "Email envoyé avec succès !", info });
};

// -------------------- Send Verification Email ------------------------
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

// -------------------- Send Forgot Password Request ------------------------
export const sendForgotPasswordRequest = async (
  toEmail: string,
  resetToken: string
) => {
  const emailResetPassword = {
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: "🔒 Réinitialisation de votre mot de passe",
    text: `Pour réinitialiser votre mot de passe, utilisez le code suivant : ${resetToken}`,
    html: `<p>Pour réinitialiser votre mot de passe, utilisez le code suivant : 
   <a href="http://localhost:3020/api/auth/reset-password?token=${resetToken}">Cliquer ici</a></p>`,
  };

  return await emailTransporter.sendMail(emailResetPassword);
};
