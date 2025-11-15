import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers";

const AuthRouter = Router();

AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/logout", AuthController.logout);
AuthRouter.post("/register", AuthController.register);

export default AuthRouter;
