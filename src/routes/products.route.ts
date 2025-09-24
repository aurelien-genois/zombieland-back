import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import { checkRoles } from "../middlewares/check-roles.middleware.js";

const router = Router();

router.get('/', checkRoles(["admin"]), productsController.getAllProducts);

router.get('/published', checkRoles(["member", "admin"]), productsController.getAllProductsByPublished);

router.get('/published/:id', checkRoles(["member", "admin"]), productsController.getProductByPublished);

router.get('/:id', checkRoles(["admin"]), productsController.getProduct);

router.post('/', checkRoles(["admin"]), productsController.createProduct);

router.patch("/:id", productsController.updateProduct);

router.delete('/:id', checkRoles(["admin"]), productsController.deleteProduct);

export default router;