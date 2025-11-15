import { DataSource } from "typeorm";

export const dbConfig = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rikkei_finalproject",
  entities: ["*/**/src/entity/*.js"],
  logging: false,
  synchronize: true,
});
