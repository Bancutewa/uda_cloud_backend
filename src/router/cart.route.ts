import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

const CartRouter = Router();

CartRouter.get("/", CartController.getAllCart);
CartRouter.get("/:id", CartController.getCartById);

CartRouter.post("/:id/checkout", CartController.checkoutCartByID);

CartRouter.get("/checkout/success/:id", CartController.checkoutCartByIDSuccess);
CartRouter.get("/checkout/cancel/:id", CartController.checkoutCartByID);
export default CartRouter;
