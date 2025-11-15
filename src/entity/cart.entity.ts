import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UsersEntity } from "./user.entity";
import { ShippingEntity } from "./shipping.entity";
import { CartItemsEntity } from "./cartItems.entity";
import { PaymentEntity } from "./payment.entity";

@Entity({ name: "carts" })
export class CartEntity extends BaseEntity {
  @Column({ default: false })
  complete: boolean;

  @OneToOne(() => UsersEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @OneToMany(() => CartItemsEntity, (cart_item) => cart_item.cart_id, {
    onDelete: "CASCADE",
  })
  cart_items: CartItemsEntity[];

  // @ManyToOne(() => ShippingEntity, { onDelete: "SET NULL" })
  // @JoinColumn({ name: "shipping_id" })
  // shipping: ShippingEntity;

  // @OneToMany(() => PaymentEntity, (payment) => payment.cart)
  // payments: PaymentEntity[];

  calculateTotalPrice(): number {
    return this.cart_items.reduce((total, cartItem) => {
      return total + cartItem.product_id.price * cartItem.quantity;
    }, 0);
  }
}
