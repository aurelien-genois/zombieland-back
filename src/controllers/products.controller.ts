import type { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { parseIdValidation } from "../schemas/utils.schema.js";
import { productSchema } from "../schemas/products.schema.js";
import { NotFoundError } from "../lib/errors.js";

const productsController = {
  async getAllProducts(req: Request, res: Response) {
    const products = await prisma.product.findMany();
    // products is always an array; no need to 404 on empty, just return []
    res.status(200).json(products);
  },

  async getAllProductsByPublished(req: Request, res: Response) {
    const products = await prisma.product.findMany({ where: { status: "published" } });
    res.status(200).json(products);
  },

  async getProduct(req: Request, res: Response) {
    const productId = await parseIdValidation.parseAsync(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError("Product is not found");
    }

    res.status(200).json(product);
  },

  async getProductByPublished(req: Request, res: Response) {
    const productId = await parseIdValidation.parseAsync(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId, status: "published" },
    });

    if (!product) {
      throw new NotFoundError("Product is not found");
    }

    res.status(200).json(product);
  },

  async createProduct(req: Request, res: Response) {
    // schema has default("published") so status is optional on input
    const { name, price, status } = await productSchema.create.parseAsync(req.body);

    const createdProduct = await prisma.product.create({
      data: { name, price, status },
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

    // ⬇️ MINIMAL CHANGE: also parse optional `status`
    const { name, price, status } = await productSchema.update.parseAsync(req.body);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price }),
        ...(status !== undefined && { status }), // ⬅️ apply status if provided
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

    res.status(200).json({
      message: `Product "${deletedProduct.name}" successfully deleted`,
    });
  },
};

export default productsController;
