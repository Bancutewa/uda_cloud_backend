import { Router } from "express";
import Authorization from "../middleware/authorization.middleware";
import Authentication from "../middleware/authentication.middleware";
import { CategoryController } from "../controllers/categories.controllers";

const CategoryRouter = Router();

CategoryRouter.get("/", CategoryController.getAllCategories);
CategoryRouter.get("/:id", CategoryController.getCategoryById);
CategoryRouter.post(
  "/",
  [Authentication, Authorization],
  CategoryController.createNewCategory
);
CategoryRouter.put(
  "/:id",
  [Authentication, Authorization],
  CategoryController.updateCategory
);
CategoryRouter.delete(
  "/:id",
  [Authentication, Authorization],
  CategoryController.deleteCategoryByID
);
CategoryRouter.delete(
  "/",
  [Authentication, Authorization],
  CategoryController.deleteManyCategories
);

export default CategoryRouter;
