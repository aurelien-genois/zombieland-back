import type { Request, Response } from "express";
import { administrationSchema } from "../schemas/administration.schema.js";
import { sendContactEmail } from "../services/emails/messages/contact.js";

export const administrationController = {
  async contact(req: Request, res: Response) {
    const { email, subject, description } =
      await administrationSchema.contact.parseAsync(req.body);

    await sendContactEmail(email, subject, description);

    res.status(200).json({ message: "Contact Administration" });
  },
};

export default administrationController;
