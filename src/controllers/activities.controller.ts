import type { Request, Response } from "express";
import { prisma } from "../models/index.js";

const activitiesController = {
  async getAllActivities(req: Request, res: Response) {
    const activities = await prisma.activity.findMany();
    console.log("activities", activities);
    res.status(200).json(activities);
  },
};

export default activitiesController;
