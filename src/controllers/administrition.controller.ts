import type { Request, Response } from "express";

export const administrationController = {
  async contact(_req: Request, res: Response) {
    res.status(200).json({ message: "Contact Administration" });
  },
};

export default administrationController;
