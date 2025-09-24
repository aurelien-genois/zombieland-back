import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { parseIdValidation } from "../schemas/utils.schema.js";
import { productSchema } from "../schemas/products.schema.js";

const productsController = {
  async getAllProducts(req: Request, res: Response) {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  },

  async getProduct(req: Request, res: Response) {
    const productId = await parseIdValidation.parseAsync(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    res.status(200).json(product);
  },

  async createProduct(req: Request, res: Response) {
    const { name, price } = await productSchema.create.parse(req.body);

    const createdProduct = await prisma.product.create({
      data: {
        name,
        price,
      },
    });
    res.status(200).json(createdProduct);
  },

  async updateProduct(req: Request, res: Response) {
    const productId = await parseIdValidation.parseAsync(req.params.id);

    const productToUpdate = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productToUpdate) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { name, price } = await productSchema.update.parseAsync(req.body);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(price && { price }),
      },
    });
    res.status(200).json(updatedProduct);
  },

  async deleteProduct(req: Request, res: Response) {
    const productId = await parseIdValidation.parseAsync(req.params.id);

    const productToDelete = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productToDelete) {
      return res.status(404).json({ error: "Product not found" });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    res
      .status(200)
      .json({
        message: `Product "${deletedProduct.name}" successfully deleted`,
      });
  },
};

export default productsController;
