import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { CartEntity } from "./cart.entity";
import { PaymentEntity } from "./payment.entity";
import { CommentEntity } from "./comment.entity";

@Entity({ name: "users" })
export class UsersEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: "user" })
  role: string;

  @OneToMany(() => PaymentEntity, (payment) => payment.user, {
    onDelete: "CASCADE",
  })
  payments: PaymentEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user_id, {
    onDelete: "CASCADE",
  })
  comments: CommentEntity[];
}
