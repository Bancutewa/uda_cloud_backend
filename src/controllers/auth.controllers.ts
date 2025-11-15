import { Request, Response } from "express";
import { UsersEntity } from "../entity/user.entity";
import { UserService } from "../services/user.services";
import * as jwt from "jsonwebtoken";
import { CartServices } from "../services/cart.services";
import { CartEntity } from "../entity/cart.entity";
import { dbConfig } from "../config/db.config";

export class AuthController {
  private static cartRepo = dbConfig.getRepository(CartEntity);

  static login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const existingUser = await UserService.getUserByOne({ username });

      if (!existingUser) {
        return res.status(404).json({ error: "Tên người dùng không tồn tại" });
      }

      if (existingUser.password !== password) {
        return res.status(400).json({ error: "Sai mật khẩu" });
      }

      const objEncode = {
        ...existingUser,
        password: "",
      };
      const token = jwt.sign(objEncode, process.env.API_SECRET_KEY, {
        expiresIn: "10h",
      });

      res.status(200).json({
        message: "Đăng nhập thành công!",
        data: objEncode,
        token,
      });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau." });
    }
  };

  static logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("token");
      res.status(200).json({
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      return res.status(401).send({ error: "Can't login" });
    }
  };

  static register = async (req: Request, res: Response) => {
    try {
      const userReq = req.body as UsersEntity;

      const existingUser = await UserService.getUserByOne({
        username: userReq.username,
      });

      if (existingUser) {
        return res.status(409).json({ error: "Tên đăng nhập đã tồn tại" });
      }

      const newUser = await UserService.createOneUser(userReq);
      const newCart: CartEntity = this.cartRepo.create({
        id: newUser.id,
        user: newUser,
        complete: false,
      });

      await CartServices.createOneCart(newCart);

      res.status(200).json({
        message: "Đăng ký thành công!",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
