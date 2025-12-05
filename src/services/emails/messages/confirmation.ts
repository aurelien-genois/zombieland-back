import { emailTransporter } from "../config/emailTransporter.service.js";
import { config } from "../../../../server.config.js";

export const sendConfirmationEmail = async (
  toEmail: string,
  verificationCode: string,
  firstname: string,
  lastname: string
) => {
  const userName = `${firstname} ${lastname}`.trim();
  const confirmationLink = `${config.server.backUrl}/auth/email-confirmation?token=${verificationCode}`;

  const html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Confirmation email</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;text-align:center;">
    <div style="max-width:600px;margin:40px auto;background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

      <!-- Titre -->
      <h1 style="color:#333;margin-bottom:20px;">Bienvenue, ${userName} 🎉</h1>

      <!-- Message -->
      <p style="font-size:16px;color:#555;line-height:1.6;margin-bottom:30px;">
        Merci de vous être inscrit sur <b>Zombieland</b>.<br/>
        Veuillez confirmer votre adresse e-mail pour activer votre compte : <br/>
        Vous serez redirigé vers la page de connexion après confirmation.
      </p>

      <!-- Bouton -->
      <a href="${confirmationLink}"
         style="display:inline-block;background:#007bff;color:#fff;padding:14px 24px;
                border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
         ✅ Confirmer mon e-mail
      </a>


      <!-- Info -->
      <p style="font-size:13px;color:#777;margin-top:25px;">
        Ce lien est valable pendant <strong>24 heures</strong>.
      </p>

      <!-- Footer -->
      <p style="margin-top:40px;font-size:12px;color:#999;">
        © 2025 Zombieland - Tous droits réservés
      </p>
    </div>
  </body>
  </html>
  `;

  const email = {
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: "🎉 Confirmez votre adresse e-mail",
    text: `Bonjour ${userName},\n\nMerci de vous être inscrit ! Cliquez sur le lien suivant pour confirmer votre e-mail : ${confirmationLink}\n\nCe lien est valable 24h.`,
    html,
  };

  return await emailTransporter.sendMail(email);
};
