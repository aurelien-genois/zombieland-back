import BaseController from "./base.controller.js";
import { prisma } from "../models/index.js";
import { activitySchema } from "../schemas/activity.schema.js";

class BaseActivityController extends BaseController {
  constructor() {
    super({
      prismaModel: prisma.activity,
      schemaCreate: activitySchema.create,
      schemaUpdate: activitySchema.update,
    });
  }
}

const newActivityController = new BaseActivityController();

export default newActivityController;
