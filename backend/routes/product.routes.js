import { Router } from "express";
import { getProducts, getProductWithName, searchProducts, getCategories } from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/search', searchProducts);
productRouter.get('/categories', getCategories);
productRouter.get('/:name', getProductWithName);

export default productRouter;