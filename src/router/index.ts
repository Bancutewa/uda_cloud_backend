import { Application } from "express";
import ProductsRouter from "./product.route";
import UserRouter from "./user.route";
import AuthRouter from "./auth.route";
import CartRouter from "./cart.route";
import CartItemsRouter from "./cartItems.route";
import CategoryRouter from "./category.route";
import CommentsRouter from "./comments.route";

const appRouter = (app: Application) => {
  app.use("/api/v1/products", ProductsRouter);
  app.use("/api/v1/category", CategoryRouter);
  app.use("/api/v1/users", UserRouter);
  app.use("/api/v1/carts", CartRouter);
  app.use("/api/v1/cartitems", CartItemsRouter);
  app.use("/api/v1/comments", CommentsRouter);

  // Authentication
  app.use("/api/v1/auth", AuthRouter);
};

export default appRouter;
