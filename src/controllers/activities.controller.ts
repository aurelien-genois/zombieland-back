import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { activitySchema } from "../schemas/activity.schema.js";
import {
  parseSlugValidation,
  parseIdValidation,
} from "../schemas/utils.schema.js";
import * as z from "zod";

const activitiesController = {
  async getAllActivities(req: Request, res: Response) {
    try {
      const {
        category,
        age_group,
        high_intensity,
        disabled_access,
        limit,
        page,
        order,
        search,
      } = await activitySchema.filter.parseAsync(req.query);

      // TODO if user not logged, filter on status "published" only
      const activities = await prisma.activity.findMany({
        where: {
          ...(category && { category_id: category }),
          ...(age_group && { minimum_age: age_group }),
          ...(high_intensity !== undefined && { high_intensity }),
          ...(disabled_access !== undefined && { disabled_access }),
          ...(search !== undefined && {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slogan: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          order === "name:asc" ? { name: "asc" } : {},
          order === "name:desc" ? { name: "desc" } : {},
        ],
      });
      res.status(200).json({ activities });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues[0].message });
      }
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getOneActivity(req: Request, res: Response) {
    try {
      const activitySlug = await parseSlugValidation.parseAsync(
        req.params.slug
      );

      // TODO if user not logged, filter on status "published" only
      const activity = await prisma.activity.findUnique({
        where: { slug: activitySlug },
      });

      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }

      res.status(200).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues[0].message });
      }
      console.error("Error fetching one activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async createActivity(req: Request, res: Response) {
    try {
      const data = activitySchema.create.parse(req.body);

      const {
        name,
        description,
        age_group,
        duration,
        disabled_access,
        high_intensity,
        image_url,
        category_id,
        saved,
      } = data;

      // could replace accented characters with non-accented equivalents
      const slug = name
        .replace(/^\s+|\s+$/g, "") // trim leading/trailing white space
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-") // remove consecutive hyphens
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, ""); // remove any non-alphanumeric characters

      // could check if an activity already exist with the same name
      // either append slug with the number found ("slug-2"), either throw error to prevent creation

      const activityWithSameSlug = await prisma.activity.findUnique({
        where: { slug: slug },
      });
      if (activityWithSameSlug) {
        return res
          .status(500)
          .json({ error: "Activity already exists with same slug" });
      }

      const foundCategory = await prisma.category.findUnique({
        where: { id: category_id },
      });
      if (category_id && !foundCategory) {
        return res.status(400).json({ error: "Category does not exist" });
      }

      const activity = await prisma.activity.create({
        data: {
          name,
          slug,
          ...(description && { description }),
          minimum_age: age_group,
          ...(duration && { duration }),
          disabled_access,
          high_intensity,
          ...(image_url && { image_url }),
          category_id,
          status: saved ? "published" : "draft",
        },
      });

      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues[0].message });
      }
      console.error("Error creating activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateActivity(req: Request, res: Response) {
    try {
      const activityId = await parseIdValidation.parseAsync(req.params.id);

      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }

      const data = await activitySchema.update.parseAsync(req.body);

      const {
        name,
        description,
        age_group,
        duration,
        disabled_access,
        high_intensity,
        image_url,
        category_id,
        saved,
      } = data;

      const foundCategory = await prisma.category.findUnique({
        where: { id: category_id },
      });
      if (category_id && !foundCategory) {
        return res.status(400).json({ error: "Category does not exist" });
      }

      const activityUpdated = await prisma.activity.update({
        where: { id: activityId },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(age_group && { minimum_age: age_group }),
          ...(duration && { duration }),
          ...(disabled_access !== undefined && { disabled_access }),
          ...(high_intensity !== undefined && { high_intensity }),
          ...(image_url && { image_url }),
          ...(category_id && { category_id }),
          ...(saved !== undefined && { status: saved ? "published" : "draft" }),
        },
      });

      res.status(200).json(activityUpdated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues[0].message });
      }
      console.error("Error update one activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteActivity(req: Request, res: Response) {
    try {
      const activityId = await parseIdValidation.parseAsync(req.params.id);

      const activity = await prisma.activity.findUnique({
        where: { id: activityId },
      });

      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }

      await prisma.activity.delete({ where: { id: activityId } });
      res.status(204).json();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.issues[0].message });
      }
      console.error("Error delete one activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default activitiesController;
