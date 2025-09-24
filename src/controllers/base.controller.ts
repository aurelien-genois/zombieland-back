import type { Request, Response } from "express";
import { utilSchema } from "../schemas/utils.schema.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";

abstract class BaseController {
  protected prismaModel: any;
  protected schemaCreate: any;
  protected schemaUpdate: any;

  constructor({
    prismaModel,
    schemaCreate,
    schemaUpdate,
  }: {
    prismaModel: any;
    schemaCreate: any;
    schemaUpdate: any;
  }) {
    this.prismaModel = prismaModel;
    this.schemaCreate = schemaCreate;
    this.schemaUpdate = schemaUpdate;
  }

  // --------------------  Get All ------------------------
  async getAll(req: Request, res: Response) {
    const { limit, offset, orderBy, direction } = req.query;
    const items = await this.prismaModel.findMany({
      take: limit ? Number(limit) : undefined,
      skip: offset ? Number(offset) : undefined,
      orderBy: orderBy
        ? { [orderBy as string]: direction || "asc" }
        : undefined,
    });
    res.json(items);
  }

  // --------------------  Get User By ID ------------------------

  async getById(req: Request, res: Response) {
    const { id } = utilSchema.parseId.parse(req.params);
    if (Number.isNaN(id)) {
      throw new BadRequestError("Invalid id");
    }

    const item = await this.prismaModel.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundError("Item not found");
    }
    res.json(item);
  }

  // --------------------  Create ------------------------
  async create(req: Request, res: Response) {
    const data = this.schemaCreate.parse(req.body);
    if (!data) {
      throw new BadRequestError("Invalid data");
    }
    const newItem = await this.prismaModel.create({ data });

    res.status(201).json(newItem);
  }

  // --------------------  Update  ------------------------
  async updateById(req: Request, res: Response) {
    const { id } = utilSchema.parseId.parse(req.params);
    if (Number.isNaN(id)) {
      throw new BadRequestError("Invalid id");
    }

    const data = this.schemaUpdate.parse(req.body);
    if (!data) {
      throw new BadRequestError("Invalid data");
    }

    const updatedItem = await this.prismaModel.update({
      where: { id },
      data,
    });

    if (!updatedItem) {
      throw new NotFoundError("Item not found");
    }
    res.json(updatedItem);
  }

  // --------------------  Delete ------------------------
  async deleteById(req: Request, res: Response) {
    const { id } = utilSchema.parseId.parse(req.params);
    if (Number.isNaN(id)) {
      throw new BadRequestError("Invalid id");
    }

    await this.prismaModel.delete({ where: { id } });
    res.status(204).end();
  }
}

export default BaseController;
