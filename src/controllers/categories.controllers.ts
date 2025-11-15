import { Request, Response } from "express";
import { dbConfig } from "../config/db.config";
import { FindOptionsOrderValue } from "typeorm";
import { Category } from "../entity/category.entity";
import { CategoriesServices } from "../services/categories.services";

export class CategoryController {
  private static categoriesRepo = dbConfig.getRepository(Category);

  static getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await CategoriesServices.getAllCategories();

      res.status(200).json({
        message: "Success",
        data: {
          categories,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getCategoryById = async (req: Request, res: Response) => {
    try {
      const categoryId = +req.params.id;
      const category = await CategoriesServices.getCategoryById(categoryId);
      res.status(200).json({
        message: "Success",
        data: category,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static createNewCategory = async (req: Request, res: Response) => {
    try {
      const categoryReq = req.body as Category;

      delete categoryReq.id;

      const newCategory = await CategoriesServices.createOneCategory(
        categoryReq
      );
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const categoryById = await CategoriesServices.getCategoryById(id);
      const categoryUpdate = await CategoriesServices.updateCategory(
        categoryById,
        req.body as Category
      );
      res.status(201).json(categoryUpdate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static deleteCategoryByID = async (req: Request, res: Response) => {
    try {
      const idCategory = +req.params.id;
      await CategoriesServices.deleteCategoryByID(idCategory);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static deleteManyCategories = async (req: Request, res: Response) => {
    try {
      if (req.query.arrayID) {
        const ids_delete: number[] = Array.isArray(req.query.arrayID)
          ? req.query.arrayID.map(Number)
          : [Number(req.query.arrayID)];
        await CategoriesServices.deleteManyCategories(ids_delete);
        res.status(204).end();
      } else {
        await CategoriesServices.deleteAllCategories();
        res.status(204).end();
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
