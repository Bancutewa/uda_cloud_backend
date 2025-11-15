import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import auth from "../middleware/authentication.middleware";
import Authentication from "../middleware/authentication.middleware";
import Authorization from "../middleware/authorization.middleware";

const UserRouter = Router();

UserRouter.get("/", UserController.getAllUser);
UserRouter.get("/profile", UserController.getAllUser);
UserRouter.get("/:id", UserController.getUserById);
UserRouter.post("", [Authentication, Authorization], UserController.createUser);
UserRouter.put(
  "/:id",
  [Authentication, Authorization],
  UserController.updateUser
);
UserRouter.delete(
  "/many",
  [Authentication, Authorization],
  UserController.deleteManyUsersByID
);
UserRouter.delete(
  "/:id",
  [Authentication, Authorization],
  UserController.deleteUserByID
);

export default UserRouter;
