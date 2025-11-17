import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { FindOptionsOrderValue } from "typeorm";
import { CartServices } from "../services/cart.services";
import * as paypal from "paypal-rest-sdk";
import { CartEntity } from "../entity/cart.entity";

export class CartController {
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getCartById = async (req: Request, res: Response) => {
    try {
      const cartId = +req.params.id;
      const cart = await CartServices.getCartById(cartId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static checkoutCartByID = async (req: Request, res: Response) => {
    try {
      const cartId = +req.params.id;
      const approvalUrl = await CartServices.checkoutCartByID(cartId);
      if (!approvalUrl) {
        return res.status(404).send("Approval URL not found");
      }
      res.status(200).json({
        message: "Payment successful and cart updated",
        approvalUrl,
      });
    } catch (error) {
      // Consider more specific error handling
      res.status(500).json({ error: error.message });
    }
  };
  static checkoutCartByIDSuccess = async (req: Request, res: Response) => {
    try {
      const payerId = req.query.PayerID as string;
      const paymentId = req.query.paymentId as string;
      const cartId = +req.params.id;

      await CartServices.completePayment(cartId, payerId, paymentId);
      const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`;
      res.redirect(successUrl);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static checkoutCartByIDFail = async (req: Request, res: Response) => {
    try {
      const failUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/fail`;
      res.redirect(failUrl);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

  static createCart = async (req: Request, res: Response) => {
    try {
      const cartReq = req.body as CartEntity;
      const cartNew = await CartServices.createOneCart(cartReq);
      res.status(201).json(cartNew);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //   static updateUser = async (req: Request, res: Response) => {
  //     try {
  //       const { id } = req.body;

  //       const userByID = await UserService.getUserById(id);
  //       const userUpdate = await UserService.updateUser(
  //         userByID,
  //         req.body as UsersEntity
  //       );
  //       res.status(201).json(userUpdate);
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   };

  //   static deleteUserByID = async (req: Request, res: Response) => {
  //     try {
  //       await UserService.deleteUserByID(+req.params.id);
  //       res.status(204).end();
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   };
  //   static deleteManyUsersByID = async (req: Request, res: Response) => {
  //     try {
  //       if (req.query.arrayID) {
  //         const ids_delete: number[] = Array.isArray(req.query.arrayID)
  //           ? req.query.arrayID.map(Number)
  //           : [Number(req.query.arrayID)];
  //         await UserService.deleteManyUsers(ids_delete);
  //         res.status(204).end();
  //       } else {
  //         await UserService.deleteAllUsers();
  //         res.status(204).end();
  //       }
  //       res.status(204).end();
  //     } catch (error) {
  //       res.status(500).json({ error: error.message });
  //     }
  //   };
}
