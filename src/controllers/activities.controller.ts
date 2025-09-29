import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { Prisma } from "@prisma/client";
import { activitySchema } from "../schemas/activity.schema.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/errors.js";
import {
  parseSlugValidation,
  parseIdValidation,
} from "../schemas/utils.schema.js";

const activitiesController = {
  // first argument is used when binding the function for the get "activities/" route to pass the required "published" status filter
  // with this binding, no need to duplicate the function code to a "getAllPublishedActivities" function
  async getAllActivities(
    args: { status?: "draft" | "published" } = {},
    req: Request,
    res: Response
  ) {
    const {
      category,
      age_group,
      high_intensity,
      disabled_access,
      limit,
      page,
      order,
      search,
      status,
    } = await activitySchema.filter.parseAsync(req.query);

    // if the route provides a status, force the filter with this status
    const statusFilter = args.status !== undefined ? args.status : status;

    // only admin users can access draft activities (should not be possible but just in case)
    const userRole = req.userRole as string | undefined;
    if (userRole !== "admin" && statusFilter === "draft") {
      throw new UnauthorizedError("Unauthorized");
    }

    const whereClause = {
      ...(category && { category_id: category }),
      ...(age_group !== undefined && { minimum_age: age_group }),
      ...(high_intensity !== undefined && { high_intensity }),
      ...(disabled_access !== undefined && { disabled_access }),
      ...(statusFilter !== undefined && { status: statusFilter }),
      ...(search !== undefined && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { slogan: { contains: search, mode: Prisma.QueryMode.insensitive } },
          {
            description: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const totalActivities = await prisma.activity.count({
      where: whereClause,
    });

    const activities = await prisma.activity.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        order === "name:asc" ? { name: "asc" } : {},
        order === "name:desc" ? { name: "desc" } : {},
      ],
    });
    res.status(200).json({
      activities,
      totalActivities,
    });
  },

  async getOneActivity(
    args: { status?: "draft" | "published" } = {},
    req: Request,
    res: Response
  ) {
    const activitySlug = await parseSlugValidation.parseAsync(req.params.slug);

    const activity = await prisma.activity.findUnique({
      where: {
        slug: activitySlug,
        // if the route provides a status, force the filter with this status
        ...(args.status !== undefined && { status: args.status }),
      },
      include: {
        category: true,
      },
    });

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    res.status(200).json(activity);
  },

  async createActivity(req: Request, res: Response) {
    const data = activitySchema.create.parse(req.body);

    const {
      name,
      slogan,
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
      throw new ConflictError("Activity already exists with same slug");
    }

    const foundCategory = await prisma.category.findUnique({
      where: { id: category_id },
    });
    if (category_id && !foundCategory) {
      throw new ConflictError("Selected category does not exist");
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        slug,
        ...(slogan && { slogan }),
        ...(description && { description }),
        minimum_age: age_group,
        ...(duration && { duration }),
        disabled_access,
        high_intensity,
        ...(image_url && { image_url }),
        category_id,
        status: saved ? "published" : "draft",
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(activity);
  },

  async updateActivity(req: Request, res: Response) {
    const activityId = await parseIdValidation.parseAsync(req.params.id);

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    const data = await activitySchema.update.parseAsync(req.body);

    const {
      name,
      slogan,
      description,
      age_group,
      duration,
      disabled_access,
      high_intensity,
      image_url,
      category_id,
      saved,
    } = data;

    if (category_id) {
      const foundCategory = await prisma.category.findUnique({
        where: { id: category_id },
      });
      if (!foundCategory) {
        throw new ConflictError("Selected category does not exist");
      }
    }

    const activityUpdated = await prisma.activity.update({
      where: { id: activityId },
      data: {
        ...(name && { name }),
        ...(slogan && { slogan }),
        ...(description && { description }),
        ...(age_group && { minimum_age: age_group }),
        ...(duration && { duration }),
        ...(disabled_access !== undefined && { disabled_access }),
        ...(high_intensity !== undefined && { high_intensity }),
        ...(image_url !== undefined && { image_url }),
        ...(category_id && { category_id }),
        ...(saved !== undefined && { status: saved ? "published" : "draft" }),
        updated_at: new Date(),
      },
      include: {
        category: true,
      },
    });

    res.status(200).json(activityUpdated);
  },

  async deleteActivity(req: Request, res: Response) {
    const activityId = await parseIdValidation.parseAsync(req.params.id);

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      throw new ConflictError("Activity not found");
    }

    await prisma.activity.delete({ where: { id: activityId } });
    res.status(204).json();
  },

  async evaluateActivity(req: Request, res: Response) {
    if (!req.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const activityId = await parseIdValidation.parseAsync(req.params.id);
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });
    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    const data = await activitySchema.evaluate.parseAsync(req.body);
    const { grade, comment } = data;

    // check if the user already evaluated this activity
    const existingUserRateActivity = await prisma.userRateActivity.findUnique({
      where: {
        activity_id: activityId,
        user_id: req.userId,
        user_rate_activity_pkey: {
          activity_id: activityId,
          user_id: req.userId,
        },
      },
    });

    // ? authorize user to update his rate instead of blocking ?
    if (existingUserRateActivity) {
      throw new ConflictError("User already rates this activity");
    }

    const rate = await prisma.userRateActivity.create({
      data: {
        activity_id: activityId,
        user_id: req.userId,
        grade: grade,
        ...(comment && { comment: comment }),
      },
    });

    res.status(201).json(rate);
  },

  async publishActivity(req: Request, res: Response) {
    const activityId = await parseIdValidation.parseAsync(req.params.id);
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });
    if (!activity) {
      throw new NotFoundError("Activity not found");
    } else if (activity.status === "published") {
      throw new ConflictError("Activity is already published");
    }

    const activityUpdated = await prisma.activity.update({
      where: { id: activityId },
      data: {
        status: "published",
        updated_at: new Date(),
      },
    });

    res.status(200).json(activityUpdated);
  },
};

export default activitiesController;
