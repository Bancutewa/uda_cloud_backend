import { Router } from "express";
import { ProductController } from "../controllers/product.controllers";
import Authorization from "../middleware/authorization.middleware";
import Authentication from "../middleware/authentication.middleware";

const ProductsRouter = Router();

ProductsRouter.get("/", ProductController.getAllProducts);
ProductsRouter.get("/category/:id", ProductController.getProductsByCategoryID);
ProductsRouter.get("/:id", ProductController.getProductById);
ProductsRouter.post(
  "/",
  [Authentication, Authorization],
  ProductController.createNewProduct
);
ProductsRouter.put(
  "/:id",
  [Authentication, Authorization],
  ProductController.updateProduct
);
ProductsRouter.delete(
  "/:id",
  [Authentication, Authorization],
  ProductController.deleteProductByID
);
ProductsRouter.delete(
  "/",
  [Authentication, Authorization],
  ProductController.deleteManyProducts
);

export default ProductsRouter;
