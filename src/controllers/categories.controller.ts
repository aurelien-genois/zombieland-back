import BaseController from "./base.controller.js";
import { prisma } from "../models/index.js";
import { categorySchema } from "../schemas/category.schema.js";

import { ConflictError } from "../lib/errors.js";
import type { Request, Response } from "express";
import { parseIdValidation } from "../schemas/utils.schema.js";
import { z } from "zod";

class CategoriesController extends BaseController {
  constructor() {
    super({
      prismaModel: prisma.category,
      schemaCreate: categorySchema.create,
      schemaUpdate: categorySchema.update,
      schemaOrderBy: z
        .enum(["name:asc", "name:desc"])
        .default("name:asc")
        .optional(),
    });
  }

  // TODO getAll: add zod schema for filtering and manage search
  // TODO create: prevent create category with same name

  async deleteById(req: Request, res: Response): Promise<void> {
    const id = parseIdValidation.parse(req.params.id);

    const activityWithSameCategory = await prisma.activity.findFirst({
      where: { category_id: id },
    });
    if (activityWithSameCategory) {
      throw new ConflictError("There are activities with this category");
    }

    await this.prismaModel.delete({ where: { id } });
    res.status(204).end();
  }
}

const categoryController = new CategoriesController();

export default categoryController;
