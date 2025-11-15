import {
  FindManyOptions,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from "typeorm";
import { dbConfig } from "../config/db.config";
import { SaledProductEntity } from "../entity/saledProduct.entity";
import { CartItemsEntity } from "../entity/cartItems.entity";

export class SaledProductServices {
  private static saledProductRepo = dbConfig.getRepository(SaledProductEntity);

  static getAllSaledProducts = async () => {
    try {
      const saledProducts = await this.saledProductRepo.find();
      return saledProducts;
    } catch (error) {
      throw error;
    }
  };

  static getSaledProductById = async (id: number) => {
    try {
      return await this.saledProductRepo.findOne({
        where: { id: id },
        relations: ["cart_item_id", "cart_item_id.product_id"],
      });
    } catch (error) {
      throw new Error(`Error getting saled product by ID: ${error.message}`);
    }
  };

  static createSaledProductByCartItem = async (cartItem: CartItemsEntity) => {
    try {
      const saledProduct = new SaledProductEntity();
      saledProduct.cartItem = cartItem;
      saledProduct.quantity = cartItem.quantity;
      saledProduct.soldAt = new Date();
      saledProduct.totalPrice = cartItem.quantity * cartItem.product_id.price;
      return await this.saledProductRepo.save(saledProduct);
    } catch (error) {
      throw new Error(`Lỗi tạo sản phẩm đã bán: ${error.message}`);
    }
  };
}
