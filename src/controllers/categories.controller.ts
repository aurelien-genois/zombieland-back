import BaseController from "./base.controller.js";
import { prisma } from "../models/index.js";
import { categorySchema } from "../schemas/category.schema.js";

import { ConflictError } from "../lib/errors.js";
import type { Request, Response } from "express";
import { utilSchema } from "../schemas/utils.schema.js";

class CategoriesController extends BaseController {
  constructor() {
    super({
      prismaModel: prisma.category,
      schemaCreate: categorySchema.create,
      schemaUpdate: categorySchema.update,
    });
  }

  // TODO Create: prevent create category with same name

  async deleteById(req: Request, res: Response): Promise<void> {
    const { id } = utilSchema.parseId.parse(req.params);

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
