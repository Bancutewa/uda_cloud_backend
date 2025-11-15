import * as jwt from "jsonwebtoken";
import { UsersEntity } from "../entity/user.entity";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.services";

const Authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const userDecode = jwt.verify(
      token,
      process.env.API_SECRET_KEY
    ) as UsersEntity;

    const userFind = await UserService.getUserById(userDecode.id);

    if (!userFind) {
      throw new Error("User not found");
    }

    req.user = userFind;
    req["token"] = token;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ error: "Token expired" });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ error: "Invalid token" });
    }

    return res
      .status(401)
      .send({ error: "Not authorized to access this resource" });
  }
};

export default Authentication;
