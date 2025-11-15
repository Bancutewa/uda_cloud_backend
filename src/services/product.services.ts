import { FindManyOptions, Like } from "typeorm";
import { dbConfig } from "../config/db.config";
import { Product } from "../entity/product.entity";
import * as dayjs from "dayjs";
import { ProductParamsRequest } from "../data/request/product.params.request";
import { Category } from "../entity/category.entity";
import { CategoriesServices } from "./categories.services";

export class ProductServices {
  private static productRepo = dbConfig.getRepository(Product);

  static getAllProducts = async ({
    productName,
    categoryName,
    sortByName,
    sortByPrice,
    sortByDate,
    limit,
    offset,
  }: ProductParamsRequest) => {
    try {
      let queryOptions: FindManyOptions<Product> = {
        relations: { category: true },
        skip: offset,
        take: limit,
      };

      queryOptions.where = {};

      if (productName) {
        queryOptions.where.name = Like(`%${productName}%`);
      }
      if (categoryName) {
        queryOptions.where.category = { name: categoryName };
      }

      if (sortByName === "asc" || sortByName === "desc") {
        queryOptions.order = {
          name: sortByName,
        };
      } else if (sortByDate === "newest" || sortByDate === "oldest") {
        queryOptions.order = {
          updated_at: sortByDate === "newest" ? "DESC" : "ASC",
        };
      } else if (sortByPrice === "asc" || sortByPrice === "desc") {
        queryOptions.order = {
          price: sortByPrice,
        };
      }
      const products = await this.productRepo.find(queryOptions);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  static getProductsByCategoryID = async (
    {
      productName,
      categoryName,
      sortByName,
      sortByPrice,
      sortByDate,
      limit,
      offset,
    }: ProductParamsRequest,
    categoryID: number
  ) => {
    try {
      let queryOptions: FindManyOptions<Product> = {
        relations: { category: true },
        skip: offset,
        take: limit,
      };

      queryOptions.where = {
        category: {
          id: categoryID,
        },
      };

      if (productName) {
        queryOptions.where.name = Like(`%${productName}%`);
      }
      if (categoryName) {
        queryOptions.where.category = { name: categoryName };
      }

      if (sortByName === "asc" || sortByName === "desc") {
        queryOptions.order = {
          name: sortByName,
        };
      } else if (sortByDate === "newest" || sortByDate === "oldest") {
        queryOptions.order = {
          created_at: sortByDate === "newest" ? "DESC" : "ASC",
        };
      } else if (sortByPrice === "asc" || sortByPrice === "desc") {
        queryOptions.order = {
          price: sortByPrice,
        };
      }
      const products = await this.productRepo.find(queryOptions);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };
  static getProductById = async (id: number) => {
    try {
      return await this.productRepo.findOne({
        where: { id: id },
        relations: {
          category: true,
        },
      });
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  };

  static createOneProduct = async (newProduct: Product) => {
    try {
      const product = this.productRepo.create(newProduct);
      return await this.productRepo.save(product);
    } catch (error) {
      console.error("Error adding products:", error);
      throw new Error(`Error adding product: ${error.message}`);
    }
  };

  static updateProduct = async (
    oldProduct: Product,
    updatedProduct: Partial<Product>
  ) => {
    try {
      const mergedProduct = this.productRepo.merge(oldProduct, updatedProduct);

      if (updatedProduct.category) {
        mergedProduct.category =
          typeof updatedProduct.category === "number"
            ? await CategoriesServices.getCategoryById(updatedProduct.category)
            : updatedProduct.category;
      }

      return await this.productRepo.save(mergedProduct);
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  };

  static deleteProductByID = async (id: number) => {
    try {
      await this.productRepo.delete({ id });
    } catch (error) {
      throw new Error(`Error deleting Product: ${error.message}`);
    }
  };
  static deleteManyProducts = async (ids: number[]) => {
    try {
      await this.productRepo.delete(ids);
    } catch (error) {
      throw new Error(`Error deleting products: ${error.message}`);
    }
  };
  static deleteAllProducts = async () => {
    try {
      await this.productRepo.clear();
    } catch (error) {
      throw new Error(`Error deleting all products: ${error.message}`);
    }
  };
}
