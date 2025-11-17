import { Request, Response } from "express";
import { CartServices } from "../services/cart.services";
import { CartEntity } from "../entity/cart.entity";

export class CartController {
  // Lấy tất cả cart (admin dùng)
  static getAllCart = async (req: Request, res: Response) => {
    try {
      const query = {
        sortByPrice: req.query.sortByName,
        sortByDate: req.query.sortByDate,
      };
      const carts = await CartServices.getAllCarts(query);
      res.status(200).json({
        message: "Success",
        carts: carts,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Lấy cart theo id
  static getCartById = async (req: Request, res: Response) => {
    try {
      const cartId = +req.params.id;
      const cart = await CartServices.getCartById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  static checkoutCartByID = async (req: Request, res: Response) => {
    try {
      const cartId = +req.params.id;

      const result = await CartServices.checkoutAndClearCart(cartId);

      return res.status(200).json({
        message: "Thanh toán thành công, giỏ hàng đã được xử lý",
        cartId: result.cartId,
        totalAmount: result.totalAmount,
        items: result.items,
      });
    } catch (error: any) {
      // thiếu hàng trong kho
      if (error.code === "OUT_OF_STOCK") {
        return res.status(400).json({ error: error.message });
      }

      // giỏ hàng không tồn tại
      if (error.code === "CART_NOT_FOUND") {
        return res.status(404).json({ error: error.message });
      }

      console.error("Checkout error:", error);
      return res
        .status(500)
        .json({ error: "Lỗi khi thanh toán giỏ hàng" });
    }
  };

  // Tuỳ bạn còn dùng 2 cái này không, có thể để nguyên:
  static checkoutCartByIDSuccess = async (
    req: Request,
    res: Response
  ) => {
    try {
      const cartId = +req.params.id;
      const successUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/success?cartId=${cartId}`;
      return res.redirect(successUrl);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  static checkoutCartByIDFail = async (
    req: Request,
    res: Response
  ) => {
    try {
      const cartId = +req.params.id;
      const failUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/fail?cartId=${cartId}`;
      return res.redirect(failUrl);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Tạo cart mới
  static createCart = async (req: Request, res: Response) => {
    try {
      const cartReq = req.body as CartEntity;
      const cartNew = await CartServices.createOneCart(cartReq);
      res.status(201).json(cartNew);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
