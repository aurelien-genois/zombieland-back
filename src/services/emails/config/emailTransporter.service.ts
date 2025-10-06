import nodemailer from "nodemailer";

const port = Number(process.env.EMAIL_PORT || 0);
const secure = port === 465;

export const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port,
  secure,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  ...(secure ? {} : { requireTLS: true }),
});

emailTransporter
  .verify()
  .then(() => {
    console.log("Email transporter ready - able to connect to SMTP server");
  })
  .catch((err) => {
    console.error(
      "Email transporter verification failed:",
      err && err.message ? err.message : err
    );
  });
