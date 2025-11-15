import { FindManyOptions, FindOneOptions } from "typeorm";
import { dbConfig } from "../config/db.config";
import { UsersParamsRequest } from "../data/request/user.params.request";
import { CartEntity } from "../entity/cart.entity";
import { CartItemsEntity } from "../entity/cartItems.entity";

export class CartItemsServices {
  private static cartItemsRepo = dbConfig.getRepository(CartItemsEntity);

  // Admin update
  static getAllCartItems = async ({ sortByDate }) => {
    try {
      let queryOptions: FindManyOptions<CartItemsEntity> = {
        // relations: {
        //   cart_id: true,
        //   product_id: true,
        // },
      };
      queryOptions.order = {
        updated_at: sortByDate === "newest" ? "DESC" : "ASC",
      };

      const carts = await this.cartItemsRepo.find(queryOptions);
      return carts;
    } catch (error) {
      throw new Error(`Error getting cartItems: ${error.message}`);
    }
  };
  static getCartItemById = async (id: number) => {
    try {
      let queryOptions: FindOneOptions<CartItemsEntity> = {
        relations: {
          cart_id: true,
          product_id: true,
        },
        where: {
          id: id,
        },
      };
      return await this.cartItemsRepo.findOne(queryOptions);
    } catch (error) {
      throw new Error(`Error getting cart item by ID: ${error.message}`);
    }
  };

  static getProductsByCartIdUser = async (id: number) => {
    try {
      let queryOptions: FindManyOptions<CartItemsEntity> = {
        relations: {
          cart_id: true,
          product_id: true,
        },
        where: {
          cart_id: {
            id: id,
          },
        },
      };
      const cartItems = await this.cartItemsRepo.find(queryOptions);
      const products = cartItems.map((cartItem) => cartItem.product_id);
      return products;
    } catch (error) {
      throw new Error(`Error getting cart item by ID: ${error.message}`);
    }
  };
  static createOneCartItems = async (newCart: CartItemsEntity) => {
    try {
      const cart = this.cartItemsRepo.create(newCart);
      return await this.cartItemsRepo.save(cart);
    } catch (error) {
      throw new Error(`Error adding user: ${error.message}`);
    }
  };

  static updateCartItemAdmin = async (
    oldCartItem: CartItemsEntity,
    updatedCartItem: CartItemsEntity
  ) => {
    try {
      const new_cart_items = this.cartItemsRepo.merge(
        oldCartItem,
        updatedCartItem
      );
      return await this.cartItemsRepo.save(new_cart_items);
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  };

  // User Services
  static getProductByCartIdUser = async (cartID: number, productID: number) => {
    try {
      let queryOptions: FindOneOptions<CartItemsEntity> = {
        relations: {
          cart_id: true,
          product_id: true,
        },
        where: {
          cart_id: {
            id: cartID,
          },
          product_id: {
            id: productID,
          },
        },
      };
      const cartItems = await this.cartItemsRepo.findOne(queryOptions);
      return cartItems;
    } catch (error) {
      throw new Error(`Error getting cart item by ID: ${error.message}`);
    }
  };

  static updateCartItemUser = async (
    updatedCartItem: CartItemsEntity,
    action: string,
    quantityChange: number = 1
  ) => {
    try {
      const updateCartItem = updatedCartItem;

      if (action === "add") {
        updateCartItem.quantity += quantityChange;
      } else if (action === "minus") {
        updateCartItem.quantity -= quantityChange;
      }
      return await this.cartItemsRepo.save(updateCartItem);
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  };
  static deleteCartByID = async (id: number) => {
    try {
      await this.cartItemsRepo.delete({ id });
    } catch (error) {
      throw new Error(`Error deleting cart: ${error.message}`);
    }
  };
  static deleteManyCarts = async (ids: number[]) => {
    try {
      await this.cartItemsRepo.delete(ids);
    } catch (error) {
      throw new Error(`Error deleting carts: ${error.message}`);
    }
  };
  static deleteAllCarts = async () => {
    try {
      await this.cartItemsRepo.clear();
    } catch (error) {
      throw new Error(`Error deleting all carts: ${error.message}`);
    }
  };
}
