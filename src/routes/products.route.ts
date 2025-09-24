import { Router } from "express";
import productsController from "../controllers/products.controller.js";

const router = Router();

router.get('/', productsController.getAllProducts);

router.get('/:id', productsController.getProduct);

router.post('/', productsController.createProduct);

router.patch('/:id', productsController.updateProduct);

router.delete('/:id', productsController.deleteProduct);

export default router;