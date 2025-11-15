import { Router } from "express";
import { CartItemsController } from "../controllers/cartitems.controller";

const CartItemsRouter = Router();

// Page Admin
CartItemsRouter.get("/", CartItemsController.getAllCartItems);
CartItemsRouter.get("/:id", CartItemsController.getCartItemsById);
CartItemsRouter.put("/:id", CartItemsController.updateCartItemAdmin);

// Page User
CartItemsRouter.get("/products/:id", CartItemsController.getProductsByCartId);
CartItemsRouter.put("/products/change", CartItemsController.updateCartItemUser);

CartItemsRouter.post("/", CartItemsController.createCartItem);
CartItemsRouter.delete("/:id", CartItemsController.deleteCartByID);

export default CartItemsRouter;
