import { userController } from "./user.controller";
import { Router } from "express";
interface IRouter {
  url: string;
  router: Router;
  startRoutes(): void;
  getRouter(): Router;
  getURL(): string;
}
export class UserRouter implements IRouter {
  url: string;
  router: Router;
  constructor() {
    this.url = "/users";
    this.router = Router();
    this.startRoutes();
  }
  getRouter(): Router {
    return this.router;
  }
  getURL(): string {
    return this.url;
  }
  startRoutes(): void {
    this.router.get("/me", (req, res, next) => {
      userController
        .getUserById(req.headers.user_id as string)
        .then((x) => {
          res.status(200).json(x);
        })
        .catch(next);
    });
  }
}
