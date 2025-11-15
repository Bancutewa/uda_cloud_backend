import { FindManyOptions, FindOneOptions } from "typeorm";
import { dbConfig } from "../config/db.config";
import { UsersParamsRequest } from "../data/request/user.params.request";
import { UsersEntity } from "../entity/user.entity";
import * as dayjs from "dayjs";

export class UserService {
  private static userRepo = dbConfig.getRepository(UsersEntity);

  static getUser = async ({
    username,
    email,
    password,
    sortByName,
    sortByDate,
  }: UsersParamsRequest) => {
    try {
      let queryOptions: FindManyOptions<UsersEntity> = {};

      if (username || email || password) {
        queryOptions.where = {};
        if (username) {
          queryOptions.where.username = username;
        }
        if (email) {
          queryOptions.where.email = email;
        }
        if (password) {
          queryOptions.where.password = password;
        }
      }

      // Add sorting options if available
      if (sortByName === "asc" || sortByName === "desc") {
        queryOptions.order = {
          name: sortByName,
        };
      } else if (sortByDate === "newest" || sortByDate === "oldest") {
        queryOptions.order = {
          updated_at: sortByDate === "newest" ? "DESC" : "ASC",
        };
      }
      // Execute the query
      const products = await this.userRepo.find(queryOptions);
      return products;
    } catch (error) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  };

  static getUserByOne = async (
    { username, password, email }: UsersParamsRequest,
    operator = "AND"
  ) => {
    try {
      let queryOptions: FindOneOptions<UsersEntity> = {};

      if (username || password || email) {
        queryOptions.where = {};

        if (operator === "AND") {
          if (username) {
            queryOptions.where.username = username;
          }
          if (password) {
            queryOptions.where.password = password;
          }
          if (email) {
            queryOptions.where.email = email;
          }
        } else if (operator === "OR") {
          queryOptions.where = [];
          if (username) {
            queryOptions.where = { username: username };
          }
          if (password) {
            queryOptions.where = { password: password };
          }
          if (email) {
            queryOptions.where = { email: email };
          }
        }
      }

      return await this.userRepo.findOne(queryOptions);
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin người dùng: ${error.message}`);
    }
  };

  static getUserById = async (id: number) => {
    try {
      return await this.userRepo.findOneBy({ id });
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  };

  static createOneUser = async (newUser: UsersEntity) => {
    try {
      const user = this.userRepo.create(newUser);
      return await this.userRepo.save(user);
    } catch (error) {
      throw new Error(`Error adding user: ${error.message}`);
    }
  };

  static updateUser = async (
    oldUser: UsersEntity,
    updatedUserInfo: UsersEntity
  ) => {
    try {
      const new_user = this.userRepo.merge(oldUser, updatedUserInfo);
      return await this.userRepo.save(new_user);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  };

  static deleteUserByID = async (id: number) => {
    try {
      await this.userRepo.delete({ id });
      console.log(123);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  };
  static deleteManyUsers = async (ids: number[]) => {
    try {
      await this.userRepo.delete(ids);
    } catch (error) {
      throw new Error(`Error deleting users: ${error.message}`);
    }
  };
  static deleteAllUsers = async () => {
    try {
      await this.userRepo.clear();
    } catch (error) {
      throw new Error(`Error deleting all users: ${error.message}`);
    }
  };
}
