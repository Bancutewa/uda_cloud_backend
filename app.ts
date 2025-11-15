import "dotenv/config";
import * as express from "express";
import { Request, Response } from "express";
import { dbConfig } from "./src/config/db.config";
import { paypalConfig } from "./src/config/paypal.config";
import * as cors from "cors";
import appRouter from "./src/router";
import { UsersEntity } from "./src/entity/user.entity";

const port = process.env.PORT || 3000;

const app: express.Application = express();
declare global {
  namespace Express {
    interface Request {
      user: UsersEntity;
    }
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// establish database connection
dbConfig
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

appRouter(app);

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
