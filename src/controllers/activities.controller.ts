import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { activitySchema } from "../schemas/activity.schema.js";

const activitiesController = {
  async getAllActivities(req: Request, res: Response) {
    try {
      const activities = await prisma.activity.findMany();
      res.status(200).json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // TODO get one activity with query param "id" or "slug"

  async createActivity(req: Request, res: Response) {
    try {
      const result = activitySchema.create.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ errors: result.error?.issues[0]?.message });
      }

      const {
        name,
        description,
        minimum_age,
        duration,
        disabled_access,
        image_url,
        category_id,
        saved,
      } = result.data;

      // could replace accented characters with non-accented equivalents
      const slug = name
        .replace(/^\s+|\s+$/g, "") // trim leading/trailing white space
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-") // remove consecutive hyphens
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, ""); // remove any non-alphanumeric characters

      // could check if an activity already exist with the same name

      const activity = await prisma.activity.create({
        data: {
          name,
          slug,
          ...(description && { description }),
          minimum_age,
          ...(duration && { duration }),
          disabled_access,
          ...(image_url && { image_url }),
          category_id,
          status: saved ? "published" : "draft",
        },
      });

      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ error: "Internal server error", detail: error });
    }
  },
};

export default activitiesController;
