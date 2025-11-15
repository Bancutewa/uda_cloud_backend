import { Request, Response } from "express";
import { CommentsServices } from "../services/comment.services";

export class CommentsController {
  static getAllComments = async (req: Request, res: Response) => {
    try {
      const query = {
        sortByDate: req.query.sortByDate,
      };
      const comments = await CommentsServices.getAllComments(query);
      res.status(200).json({
        message: "Success",
        comments,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getCommentById = async (req: Request, res: Response) => {
    try {
      const commentID = +req.params.id;
      const comment = await CommentsServices.getCommentById(commentID);
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getCommentsByProductID = async (req: Request, res: Response) => {
    try {
      const productID = +req.params.productID;
      const comment = await CommentsServices.getCommentsByIdProduct(productID);
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getCommentByUserIDProductID = async (req: Request, res: Response) => {
    try {
      const userId = +req.params.userId;
      const productId = +req.params.productId;
      const cart = await CommentsServices.getCommentByIdUser(userId, productId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static createComment = async (req: Request, res: Response) => {
    try {
      const commentReq = req.body;
      const new_comment = await CommentsServices.createOneComment(commentReq);
      return res.status(201).json(new_comment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  static updateComment = async (req: Request, res: Response) => {
    try {
      const { user_id, product_id } = req.body;
      const commentExits = await CommentsServices.getCommentByIdUser(
        user_id,
        product_id
      );

      if (commentExits) {
        const updated_cart = await CommentsServices.updateComment(
          commentExits,
          req.body
        );

        return res.status(201).json(updated_cart);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  static deleteCommentByID = async (req: Request, res: Response) => {
    try {
      await CommentsServices.deleteCommentByID(+req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
