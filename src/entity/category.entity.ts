import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Product } from "./product.entity";

@Entity({ name: "categories" })
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
