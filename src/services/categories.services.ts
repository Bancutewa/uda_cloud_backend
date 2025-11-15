import { FindManyOptions } from "typeorm";
import { dbConfig } from "../config/db.config";
import { Product } from "../entity/product.entity";
import * as dayjs from "dayjs";
import { ProductParamsRequest } from "../data/request/product.params.request";
import { Category } from "../entity/category.entity";

export class CategoriesServices {
  private static categoryRepo = dbConfig.getRepository(Category);

  static getAllCategories = async () => {
    try {
      let queryOptions: FindManyOptions<Category> = {
        // relations: { product: true },
      };

      const categories = await this.categoryRepo.find(queryOptions);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  static getCategoryById = async (id: number) => {
    try {
      return await this.categoryRepo.findOneBy({ id });
    } catch (error) {
      throw new Error(`Error getting categorie by ID: ${error.message}`);
    }
  };

  static createOneCategory = async (newCategory: Category) => {
    try {
      const category = this.categoryRepo.create(newCategory);
      return await this.categoryRepo.save(category);
    } catch (error) {
      console.error("Error adding category:", error);
      throw new Error(`Error adding category: ${error.message}`);
    }
  };

  static updateCategory = async (
    oldCategory: Category,
    updatedCategory: Category
  ) => {
    try {
      const product = this.categoryRepo.merge(oldCategory, updatedCategory);
      return await this.categoryRepo.save(product);
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  };

  static deleteCategoryByID = async (id: number) => {
    try {
      await this.categoryRepo.delete({ id });
    } catch (error) {
      throw new Error(`Error deleting Category: ${error.message}`);
    }
  };
  static deleteManyCategories = async (ids: number[]) => {
    try {
      await this.categoryRepo.delete(ids);
    } catch (error) {
      throw new Error(`Error deleting Categories: ${error.message}`);
    }
  };
  static deleteAllCategories = async () => {
    try {
      await this.categoryRepo.clear();
    } catch (error) {
      throw new Error(`Error deleting all Categories: ${error.message}`);
    }
  };
}
