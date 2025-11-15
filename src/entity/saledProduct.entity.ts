import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CartItemsEntity } from "./cartItems.entity";

@Entity({ name: "saled_product" })
export class SaledProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CartItemsEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_item_id" })
  cartItem: CartItemsEntity;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  soldAt: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  totalPrice: number;
}
