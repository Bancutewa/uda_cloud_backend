import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { FindOptionsOrderValue } from "typeorm";
import { CartItemsServices } from "../services/cartItems.services";
import { CartItemsEntity } from "../entity/cartItems.entity";

export class CartItemsController {
  static getAllCartItems = async (req: Request, res: Response) => {
    try {
      const query = {
        sortByDate: req.query.sortByDate,
      };
      const carts = await CartItemsServices.getAllCartItems(query);
      res.status(200).json({
        message: "Success",
        carts: carts,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getCartItemsById = async (req: Request, res: Response) => {
    try {
      const cartId = +req.params.id;
      const cart = await CartItemsServices.getCartItemById(cartId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getProductsByCartId = async (req: Request, res: Response) => {
    try {
      const cartId = +req.params.id;
      const cart = await CartItemsServices.getProductsByCartIdUser(cartId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static createCartItem = async (req: Request, res: Response) => {
    try {
      const cartItemReq = req.body;
      const cartItemExits = await CartItemsServices.getProductByCartIdUser(
        cartItemReq.cart_id,
        cartItemReq.product_id
      );

      if (cartItemExits) {
        const updated_cart = await CartItemsServices.updateCartItemUser(
          cartItemExits,
          "add",
          cartItemReq.quantity
        );
        return res.status(201).json(updated_cart);
      } else {
        const new_cart_item = await CartItemsServices.createOneCartItems(
          cartItemReq
        );
        return res.status(201).json(new_cart_item);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  // Admin Page
  static updateCartItemAdmin = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const CartByID = await CartItemsServices.getCartItemById(id);
      const CartUpdate = await CartItemsServices.updateCartItemAdmin(
        CartByID,
        req.body as CartItemsEntity
      );
      res.status(201).json(CartUpdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateCartItemUser = async (req: Request, res: Response) => {
    try {
      const { cart_id, product_id, action, quantity } = req.body;

      const cartItemExits = await CartItemsServices.getProductByCartIdUser(
        cart_id,
        product_id
      );

      if (cartItemExits) {
        const updated_cart = await CartItemsServices.updateCartItemUser(
          cartItemExits,
          action,
          quantity
        );

        return res.status(201).json(updated_cart);
      } else {
        const new_cart_item = await CartItemsServices.createOneCartItems(
          req.body
        );
        return res.status(201).json(new_cart_item);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  static deleteCartByID = async (req: Request, res: Response) => {
    try {
      await CartItemsServices.deleteCartByID(+req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
