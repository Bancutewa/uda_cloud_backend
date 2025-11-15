import { Request, Response } from "express";
import { ProductServices } from "../services/product.services";
import { dbConfig } from "../config/db.config";
import { Product } from "../entity/product.entity";
import { ProductParamsRequest } from "../data/request/product.params.request";
import { FindOptionsOrderValue } from "typeorm";

export class ProductController {
  private static productRepo = dbConfig.getRepository(Product);

  static getAllProducts = async (req: Request, res: Response) => {
    try {
      const PAGE: number = +req.query.page || 1;
      const LIMIT: number = +req.query.limit || 100;
      const [PRODUCTS, TOTAL_PRODUCTS] = await this.productRepo.findAndCount();
      const TOTAL_PAGES = Math.ceil(TOTAL_PRODUCTS / LIMIT);

      const query: ProductParamsRequest = {
        productName: req.query.productName as string,
        categoryName: req.query.categoryName,
        sortByPrice: req.query.sortByPrice as FindOptionsOrderValue,
        sortByName: req.query.sortByName as FindOptionsOrderValue,
        sortByDate: req.query.sortByDate as "newest" | "oldest",
        limit: LIMIT,
        offset: (PAGE - 1) * LIMIT,
      };

      const products = await ProductServices.getAllProducts(query);

      res.status(200).json({
        message: "Success",
        data: {
          pagination: {
            page: Number(PAGE),
            limit: Number(LIMIT),
            totalPages: TOTAL_PAGES,
            totalElements: TOTAL_PRODUCTS,
          },
          products: products,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getProductsByCategoryID = async (req: Request, res: Response) => {
    try {
      const categoryID = +req.params.id;

      const PAGE: number = +req.query.page || 1;
      const LIMIT: number = +req.query.limit || 100;
      const [PRODUCTS, TOTAL_PRODUCTS] = await this.productRepo.findAndCount({
        where: {
          category: {
            id: categoryID,
          },
        },
      });
      const TOTAL_PAGES = Math.ceil(TOTAL_PRODUCTS / LIMIT);

      const query: ProductParamsRequest = {
        productName: req.query.productName as string,
        categoryName: req.query.categoryName,
        sortByPrice: req.query.sortByPrice as FindOptionsOrderValue,
        sortByName: req.query.sortByName as FindOptionsOrderValue,
        sortByDate: req.query.sortByDate as "newest" | "oldest",
        limit: LIMIT,
        offset: (PAGE - 1) * LIMIT,
      };

      const products = await ProductServices.getProductsByCategoryID(
        query,
        categoryID
      );

      res.status(200).json({
        message: "Success",
        data: {
          pagination: {
            page: Number(PAGE),
            limit: Number(LIMIT),
            totalPages: TOTAL_PAGES,
            totalElements: TOTAL_PRODUCTS,
          },
          products: products,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getProductById = async (req: Request, res: Response) => {
    try {
      const productId = +req.params.id;
      const product = await ProductServices.getProductById(productId);
      res.status(200).json({
        message: "Success",
        data: product,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static createNewProduct = async (req: Request, res: Response) => {
    try {
      const productReq = req.body as Product;

      delete productReq.id;

      const newProduct = await ProductServices.createOneProduct(productReq);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const productById = await ProductServices.getProductById(id);
      console.log(productById);
      console.log(req.body);

      const productUpdate = await ProductServices.updateProduct(
        productById,
        req.body as Product
      );
      res.status(201).json(productUpdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static deleteProductByID = async (req: Request, res: Response) => {
    try {
      const idProduct = +req.params.id;
      await ProductServices.deleteProductByID(idProduct);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static deleteManyProducts = async (req: Request, res: Response) => {
    try {
      if (req.query.arrayID) {
        const ids_delete: number[] = Array.isArray(req.query.arrayID)
          ? req.query.arrayID.map(Number)
          : [Number(req.query.arrayID)];
        await ProductServices.deleteManyProducts(ids_delete);
        res.status(204).end();
      } else {
        await ProductServices.deleteAllProducts();
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
