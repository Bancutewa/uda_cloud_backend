import { Router } from "express";
import { CommentsController } from "../controllers/comments.controller";

const CommentsRouter = Router();

CommentsRouter.get("/", CommentsController.getAllComments);
CommentsRouter.get("/:id", CommentsController.getCommentById);

CommentsRouter.get(
  "/product/:productID",
  CommentsController.getCommentsByProductID
);
CommentsRouter.get(
  "/user/:userID/:productId",
  CommentsController.getCommentByUserIDProductID
);
CommentsRouter.put("/", CommentsController.updateComment);

CommentsRouter.post("/", CommentsController.createComment);
CommentsRouter.delete("/:id", CommentsController.deleteCommentByID);

export default CommentsRouter;
