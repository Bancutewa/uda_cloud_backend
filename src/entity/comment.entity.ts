import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CartEntity } from "./cart.entity";
import { UsersEntity } from "./user.entity";
import { Product } from "./product.entity";

@Entity({ name: "comments" })
export class CommentEntity extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product_id: Product;

  @ManyToOne(() => UsersEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user_id: UsersEntity;
}
