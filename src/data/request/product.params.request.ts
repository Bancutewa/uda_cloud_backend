import { FindOptionsOrderValue } from "typeorm";

export type ProductParamsRequest = {
  productName?: string;
  categoryName: any;
  sortByName: FindOptionsOrderValue;
  sortByPrice: FindOptionsOrderValue;
  sortByDate: "newest" | "oldest";
  limit: number;
  offset: number;
};
