import { Request, Response } from "express";
import { URL_USER } from "../constant/url.constant";

const Authorization = async (req: Request, res: Response, next: Function) => {
  try {
    const user = req.user;
    const url = req.baseUrl;
    const role = user.role;

    if (role === "admin") {
      next();
      return;
    }
    res.status(403).json({ error: "Permission denied" });
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};

export default Authorization;
