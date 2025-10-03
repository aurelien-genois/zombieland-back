import { emailTransporter } from "../config/emailTransporter.service.js";
import { config } from "../../../../server.config.js";

export const sendForgotPasswordRequest = async (
  toEmail: string,
  resetToken: string
) => {
  const resetLink = `${config.server.frontUrl}/reset-password?token=${resetToken}`;

  const html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Réinitialisation du mot de passe</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;text-align:center;">
    <div style="max-width:600px;margin:40px auto;background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

      <!-- Titre -->
      <h1 style="color:#333;margin-bottom:20px;">🔒 Réinitialisation du mot de passe</h1>
      
      <!-- Message -->
      <p style="font-size:16px;color:#555;line-height:1.6;margin-bottom:30px;">
        Vous avez demandé à réinitialiser votre mot de passe.<br/>
        Cliquez sur le bouton ci-dessous pour en définir un nouveau :
      </p>
      
      <!-- Bouton -->
      <a href="${resetLink}"
         style="display:inline-block;background:#007bff;color:#fff;padding:14px 24px;
                border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
         🔑 Réinitialiser mon mot de passe
      </a>

      <!-- Info -->
      <p style="font-size:13px;color:#777;margin-top:25px;">
        Ce lien est valable pendant <strong>1 heure</strong>. <br/>
        Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.
      </p>
      
      <!-- Footer -->
      <p style="margin-top:40px;font-size:12px;color:#999;">
        © 2025 Zombieland - Sécurité avant tout 🛡️
      </p>
    </div>
  </body>
  </html>
  `;

  const emailResetPassword = {
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: "🔒 Réinitialisation de votre mot de passe",
    text: `Vous avez demandé à réinitialiser votre mot de passe. Utilisez ce lien : ${resetLink}\n\nCe lien est valable 1 heure.`,
    html,
  };

  return await emailTransporter.sendMail(emailResetPassword);
};
