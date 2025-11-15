import { FindOptionsOrderValue } from "typeorm";

export type UsersParamsRequest = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  sortByName?: FindOptionsOrderValue;
  sortByDate?: "newest" | "oldest";
};
