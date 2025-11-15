import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { Product } from "./product.entity";
import { BaseEntity } from "./base.entity";

@Entity({ name: "cartitems" })
export class CartItemsEntity extends BaseEntity {
  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => CartEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cart_id" })
  cart_id: CartEntity;

  @ManyToOne(() => Product, { onDelete: "SET NULL" })
  @JoinColumn({ name: "product_id" })
  product_id: Product;
}
