import { FindManyOptions, FindOneOptions } from "typeorm";
import { dbConfig } from "../config/db.config";
import { CartEntity } from "../entity/cart.entity";
import { Product } from "../entity/product.entity";
import * as paypal from "paypal-rest-sdk";
import { CartItemsEntity } from "../entity/cartItems.entity";
import { SaledProductServices } from "./saledProduct.services";


export class CartServices {
  private static cartRepo = dbConfig.getRepository(CartEntity);

  static getAllCarts = async ({ sortByDate }) => {
    try {
      let queryOptions: FindManyOptions<CartEntity> = {};
      if (sortByDate === "newest" || sortByDate === "oldest") {
        queryOptions.order = {
          updated_at: sortByDate === "newest" ? "DESC" : "ASC",
        };
      }
      const carts = await this.cartRepo.find(queryOptions);
      return carts;
    } catch (error) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  };

  static getCartById = async (id: number) => {
    try {
      const queryOptions: FindOneOptions<CartEntity> = {
        relations: ["user", "cart_items", "cart_items.product_id"],
        where: { id },
      };

      return await this.cartRepo.findOne(queryOptions);
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  };

  static createOneCart = async (newCart: CartEntity) => {
    try {
      const cart = this.cartRepo.create(newCart);
      return await this.cartRepo.save(cart);
    } catch (error) {
      throw new Error(`Error adding user: ${error.message}`);
    }
  };

  static checkoutCartByID = async (id: number) => {
    try {
      const cart = await this.cartRepo.findOne({
        where: { id: id },
        relations: ["cart_items", "cart_items.product_id"],
      });

      if (cart.cart_items.length === 0) {
        throw new Error("Giỏ hàng trống.");
      }

      const payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/v1/carts/checkout/success/${cart.id}`,
          cancel_url: `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/v1/carts/checkout/cancel/${cart.id}`,
        },
        transactions: [
          {
            item_list: {
              items: cart.cart_items.map((cartItem) => ({
                name: cartItem.product_id.name.toString(),
                sku: cartItem.product_id.id.toString(),
                price: cartItem.product_id.price.toString(),
                currency: "USD",
                quantity: cartItem.quantity,
              })),
            },
            amount: {
              currency: "USD",
              total: cart.calculateTotalPrice().toString(),
            },
            description: "Payment Description",
          },
        ],
      };

      return new Promise((resolve, reject) => {
        paypal.payment.create(payment_json, (error, payment) => {
          if (error) {
            reject(
              new Error(`Error creating PayPal payment: ${error.message}`)
            );
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                resolve(payment.links[i].href);
              }
            }
            reject(new Error("Failed to obtain PayPal payment link"));
          }
        });
      });
    } catch (error) {
      throw new Error(`Error adding user: ${error.message}`);
    }
  };

  static completePayment = async (
    cartId: number,
    payerId: string,
    paymentId: string
  ) => {
    try {
      const cart = await this.cartRepo.findOne({
        where: { id: cartId },
        relations: ["cart_items", "cart_items.product_id"],
      });

      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: cart.calculateTotalPrice().toString(),
            },
          },
        ],
      };

      await new Promise((resolve, reject) => {
        paypal.payment.execute(
          paymentId,
          execute_payment_json,
          (error, payment) => {
            if (error) {
              reject(
                new Error(`Error execute PayPal payment: ${error.response}`)
              );
            } else {
              resolve(payment);
            }
          }
        );
      });

      // ===============Trừ số lượng của sản phẩm sau khi mua hàng======================
      await this.cartRepo.manager.transaction(
        async (transactionalEntityManager) => {
          for (const cartItem of cart.cart_items) {
            const newSaledProduct =
              await SaledProductServices.createSaledProductByCartItem(cartItem);
            console.log(newSaledProduct);
            console.log(await SaledProductServices.getAllSaledProducts());

            const product = cartItem.product_id;
            if (product.quantity < cartItem.quantity) {
              throw new Error("Số lượng trong kho không đủ");
            }
            product.quantity -= cartItem.quantity;

            await transactionalEntityManager.save(product);
          }

          await transactionalEntityManager.delete(CartItemsEntity, {
            cart_id: { id: cartId },
          });
        }
      );

      return "Success (Mua hàng thành công)";
    } catch (error) {
      throw new Error(`Error completing payment: ${error.message}`);
    }
  };

  // Thanh toán nội bộ (không qua PayPal): trừ tồn kho, tạo SaledProduct, xoá cart items
  static checkoutAndClearCart = async (cartId: number) => {
    // Adapted to use project's DataSource (`dbConfig`) and existing entities/relations
    return dbConfig.transaction(async (manager) => {
      const cartRepo = manager.getRepository(CartEntity);
      const productRepo = manager.getRepository(Product);
      const cartItemRepo = manager.getRepository(CartItemsEntity);

      // 1. Load cart with items and products
      const cart = await cartRepo.findOne({
        where: { id: cartId },
        relations: ["cart_items", "cart_items.product_id"],
      });

      if (!cart) {
        const err: any = new Error("Cart không tồn tại");
        err.code = "CART_NOT_FOUND";
        throw err;
      }

      if (!cart.cart_items || cart.cart_items.length === 0) {
        const err: any = new Error("Giỏ hàng đang trống");
        err.code = "CART_EMPTY";
        throw err;
      }

      // 2. Check stock
      for (const item of cart.cart_items) {
        const product = item.product_id as any;
        if (product.quantity < item.quantity) {
          const err: any = new Error(
            `Sản phẩm "${product.name}" không đủ số lượng trong kho`
          );
          err.code = "OUT_OF_STOCK";
          throw err;
        }
      }

      // 3. Decrement stock and save products
      let totalAmount = 0;
      for (const item of cart.cart_items) {
        const product = item.product_id as any;
        product.quantity -= item.quantity;
        await productRepo.save(product);
        totalAmount += (product.price || 0) * item.quantity;

        // create SaledProduct record if your flow needs it
        await SaledProductServices.createSaledProductByCartItem(item);
      }

      // 4. Clear cart items and mark cart as PAID
      for (const item of cart.cart_items) {
        await cartItemRepo.remove(item);
      }

      cart.cart_items = [] as any;
      (cart as any).status = "PAID";
      await cartRepo.save(cart);

      // 5. Return summary
      return {
        cartId: cart.id,
        totalAmount,
        items: [],
      };
    });
  };

  static deleteCartByID = async (id: number) => {
    try {
      await this.cartRepo.delete({ id });
    } catch (error) {
      throw new Error(`Error deleting cart: ${error.message}`);
    }
  };
  static deleteManyCarts = async (ids: number[]) => {
    try {
      await this.cartRepo.delete(ids);
    } catch (error) {
      throw new Error(`Error deleting carts: ${error.message}`);
    }
  };
  static deleteAllCarts = async () => {
    try {
      await this.cartRepo.clear();
    } catch (error) {
      throw new Error(`Error deleting all carts: ${error.message}`);
    }
  };
}
