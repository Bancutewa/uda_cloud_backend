import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CartEntity } from "./cart.entity";
import { UsersEntity } from "./user.entity";

@Entity({ name: "payments" })
export class PaymentEntity extends BaseEntity {
  @Column({ name: "method_payment" })
  methodPayment: string;

  @OneToOne(() => CartEntity, { cascade: true })
  @JoinColumn({ name: "cart_id" })
  cart: CartEntity;

  @ManyToOne(() => UsersEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;
}
