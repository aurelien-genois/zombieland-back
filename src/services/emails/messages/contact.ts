import { configDotenv } from "dotenv";
import { emailTransporter } from "../config/emailTransporter.service.js";

export const sendContactEmail = async (
  toEmail: string,
  subject: string,
  description: string
) => {
  const html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>Contact</title>
  </head>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;text-align:center;">
    <div style="max-width:600px;margin:40px auto;background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

      <!-- Titre -->
      <h1 style="color:#333;margin-bottom:20px;">Nouveau message de contact</h1>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />

      <!-- Email de l'expéditeur -->
      <p style="font-size:16px;color:#555;line-height:1.6;margin-bottom:30px;">
        De : ${toEmail}<br/>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      </p>

      <!-- Subject -->
      <h2 style="color:#333;margin-bottom:10px;">Sujet : ${subject}</h2>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />

      <!-- Description -->
      <p style="font-size:16px;color:#555;line-height:1.6;">
        ${description}
      </p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
    
      <!-- Footer -->
      <p style="margin-top:40px;font-size:12px;color:#999;">
        © 2025 Zombieland - Sécurité avant tout 🛡️
      </p>
    </div>
  </body>
  </html>
  `;

  const emailContact = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_ADMIN_EMAIL,
    subject: `Nouveau message de contact : ${subject}`,
    html,
  };

  return await emailTransporter.sendMail(emailContact);
};
