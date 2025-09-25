import type { Request, Response } from "express";
import type { ZodType } from "zod";
import { z } from "zod";
import { utilSchema } from "../schemas/utils.schema.js";
import { NotFoundError } from "../lib/errors.js";
import {
  directionValidation,
  limitValidation,
  offsetValidation,
} from "../schemas/query.schema.js";

abstract class BaseController {
  protected prismaModel: any;
  protected schemaCreate: ZodType;
  protected schemaUpdate: ZodType;
  protected schemaOrderBy: ZodType<string | undefined>;

  constructor({
    prismaModel,
    schemaCreate,
    schemaUpdate,
    schemaOrderBy,
  }: {
    prismaModel: any;
    schemaCreate: ZodType;
    schemaUpdate: ZodType;
    schemaOrderBy?: ZodType<string | undefined>;
  }) {
    this.prismaModel = prismaModel;
    this.schemaCreate = schemaCreate;
    this.schemaUpdate = schemaUpdate;
    this.schemaOrderBy = schemaOrderBy || z.string().optional();
  }

  // --------------------  Get All ------------------------
  async getAll(req: Request, res: Response): Promise<void> {
    const limit = limitValidation.parse(req.query.limit);
    const offset = offsetValidation.parse(req.query.offset);
    const orderBy = this.schemaOrderBy.parse(req.query.orderBy);
    const direction = directionValidation.parse(req.query.direction);

    const items = await this.prismaModel.findMany({
      take: limit,
      skip: offset,
      orderBy: orderBy ? { [orderBy]: direction } : undefined,
    });

    res.json(items);
  }

  // --------------------  Get By ID ------------------------
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = utilSchema.parseId.parse(req.params);
    const item = await this.prismaModel.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    res.json(item);
  }

  // --------------------  Create ------------------------
  async create(req: Request, res: Response): Promise<void> {
    const data = this.schemaCreate.parse(req.body);
    const newItem = await this.prismaModel.create({ data });
    res.status(201).json(newItem);
  }

  // --------------------  Update ------------------------
  async updateById(req: Request, res: Response): Promise<void> {
    const { id } = utilSchema.parseId.parse(req.params);
    const item = await this.prismaModel.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    const data = this.schemaUpdate.parse(req.body);
    const updatedItem = await this.prismaModel.update({
      where: { id },
      data,
    });
    res.json(updatedItem);
  }

  // --------------------  Delete ------------------------
  async deleteById(req: Request, res: Response): Promise<void> {
    const { id } = utilSchema.parseId.parse(req.params);
    const item = await this.prismaModel.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    await this.prismaModel.delete({ where: { id } });
    res.status(204).end();
  }
}

export default BaseController;
