import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Category } from "./category.entity";
import { CommentEntity } from "./comment.entity";
import { CartItemsEntity } from "./cartItems.entity";

@Entity({ name: "products" })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column({ default: 1 })
  storage: boolean;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => CommentEntity, (comment) => comment.product_id)
  comments: CommentEntity[];

  @OneToMany(() => CartItemsEntity, (cart_item) => cart_item.product_id, {
    onDelete: "CASCADE",
  })
  product: CartItemsEntity[];
}
