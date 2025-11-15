import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { UsersParamsRequest } from "../data/request/user.params.request";
import { FindOptionsOrderValue } from "typeorm";
import { UsersEntity } from "../entity/user.entity";
import { CartEntity } from "../entity/cart.entity";
import { dbConfig } from "../config/db.config";
import { CartServices } from "../services/cart.services";

export class UserController {
  private static cartRepo = dbConfig.getRepository(CartEntity);

  static getAllUser = async (req: Request, res: Response) => {
    try {
      const query: UsersParamsRequest = {
        username: req.query.username as string,
        email: req.query.email as string,
        name: req.query.email as string,
        sortByName: req.query.sortByName as FindOptionsOrderValue,
        sortByDate: req.query.sortByDate as "newest" | "oldest",
      };
      const users = await UserService.getUser(query);
      res.status(200).json({
        message: "Success",
        users: users,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getUserById = async (req: Request, res: Response) => {
    try {
      const userId = +req.params.id;
      const user = await UserService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static createUser = async (req: Request, res: Response) => {
    try {
      const userReq = req.body as UsersEntity;
      const { username } = userReq;
      const existUser = await UserService.getUserByOne({ username });

      if (existUser) {
        return res.status(409).json({ error: "Tên đăng nhập đã tồn tại" });
      }
      const userNew = await UserService.createOneUser(userReq);
      const newCart: CartEntity = this.cartRepo.create({
        id: userNew.id,
        user: userNew,
      });

      await CartServices.createOneCart(newCart);
      res.status(201).json(userNew);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const userByID = await UserService.getUserById(id);
      const userUpdate = await UserService.updateUser(
        userByID,
        req.body as UsersEntity
      );
      res.status(201).json(userUpdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static deleteUserByID = async (req: Request, res: Response) => {
    try {
      const idUser = +req.params.id;

      await UserService.deleteUserByID(idUser);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static deleteManyUsersByID = async (req: Request, res: Response) => {
    try {
      if (req.query.arrayID) {
        const ids_delete: number[] = Array.isArray(req.query.arrayID)
          ? req.query.arrayID.map(Number)
          : [Number(req.query.arrayID)];
        await UserService.deleteManyUsers(ids_delete);
        res.status(204).end();
      } else {
        await UserService.deleteAllUsers();
        res.status(204).end();
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
