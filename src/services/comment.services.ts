import { FindManyOptions, FindOneOptions } from "typeorm";
import { dbConfig } from "../config/db.config";
import { CartItemsEntity } from "../entity/cartItems.entity";
import { CommentEntity } from "../entity/comment.entity";

export class CommentsServices {
  private static commentsRepo = dbConfig.getRepository(CommentEntity);

  // Admin update
  static getAllComments = async ({ sortByDate }) => {
    try {
      let queryOptions: FindManyOptions<CommentEntity> = {
        relations: {
          user_id: true,
          //   product_id: true,
        },
      };
      queryOptions.order = {
        updated_at: sortByDate === "newest" ? "DESC" : "ASC",
      };

      const comments = await this.commentsRepo.find(queryOptions);
      return comments;
    } catch (error) {
      throw new Error(`Error getting cartItems: ${error.message}`);
    }
  };
  static getCommentById = async (id: number) => {
    try {
      let queryOptions: FindOneOptions<CommentEntity> = {
        relations: {
          user_id: true,
          product_id: true,
        },
        where: {
          id: id,
        },
      };
      return await this.commentsRepo.findOne(queryOptions);
    } catch (error) {
      throw new Error(`Error getting comment by ID: ${error.message}`);
    }
  };

  static getCommentsByIdProduct = async (id: number) => {
    try {
      let queryOptions: FindManyOptions<CommentEntity> = {
        relations: {
          user_id: true,
          product_id: true,
        },
        where: {
          product_id: {
            id: id,
          },
        },
      };
      const comments = await this.commentsRepo.find(queryOptions);
      return comments;
    } catch (error) {
      throw new Error(`Error getting comments item by ID: ${error.message}`);
    }
  };

  static getCommentByIdUser = async (user_id: number, productID: number) => {
    try {
      let queryOptions: FindOneOptions<CommentEntity> = {
        relations: {
          user_id: true,
          product_id: true,
        },
        where: {
          user_id: {
            id: user_id,
          },
          product_id: {
            id: productID,
          },
        },
      };
      const comment = await this.commentsRepo.findOne(queryOptions);
      return comment;
    } catch (error) {
      throw new Error(`Error getting cart item by ID: ${error.message}`);
    }
  };

  static createOneComment = async (newComment: CommentEntity) => {
    try {
      const comment = this.commentsRepo.create(newComment);
      return await this.commentsRepo.save(comment);
    } catch (error) {
      throw new Error(`Error adding comment: ${error.message}`);
    }
  };

  static updateComment = async (
    oldComment: CommentEntity,
    updatedComment: CommentEntity
  ) => {
    try {
      const new_cart_items = this.commentsRepo.merge(
        oldComment,
        updatedComment
      );
      return await this.commentsRepo.save(new_cart_items);
    } catch (error) {
      throw new Error(`Error updating cart: ${error.message}`);
    }
  };
  static deleteCommentByID = async (id: number) => {
    try {
      await this.commentsRepo.delete({ id });
    } catch (error) {
      throw new Error(`Error deleting cart: ${error.message}`);
    }
  };
}
