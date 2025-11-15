import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CartEntity } from "./cart.entity";

@Entity({ name: "shipping" })
export class ShippingEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  price: boolean;

  // @OneToMany(() => CartEntity, (carts) => carts.shipping)
  // carts: CartEntity[];
}
