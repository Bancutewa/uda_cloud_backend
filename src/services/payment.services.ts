import { FindManyOptions, FindOneOptions } from "typeorm";
import { dbConfig } from "../config/db.config";
import { CartEntity } from "../entity/cart.entity";
import { Product } from "../entity/product.entity";
import { PaymentEntity } from "../entity/payment.entity";

export class PaymentServices {
  private static paymentRepo = dbConfig.getRepository(PaymentEntity);
  static processPaymentPaypal = async () => {
    const paypal = require("paypal-rest-sdk");
    paypal.configure({
      mode: "sandbox", // 'sandbox' for testing, 'live' for production
      client_id: "YOUR_CLIENT_ID",
      client_secret: "YOUR_CLIENT_SECRET",
    });
  };
}
