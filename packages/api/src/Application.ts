import express, { Express, Request, Response, NextFunction } from "express";
import { RouteMap } from "./RouteMap";
import { GlobalException } from "./utils/exceptions/global.exception";
import cors from "cors";
export class Application {
  app: Express;
  constructor(routes: RouteMap[]) {
    this.app = express();
    this.useMiddlewares();
    this.initRoutes(routes);
  }
  getExpress() {
    return this.app;
  }
  private initRoutes(routes: RouteMap[]) {
    for (const route of routes) {
      this.app.use(route.url, route.router);
    }
  }
  private useMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(this.errorHandler);
  }
  private errorHandler(
    error: GlobalException,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(error.status).json({
      message: error.message,
      status: error.status,
    });
    console.error(error.error);
  }
  start() {
    this.app.listen(4041, () => {
      console.log(`running at 4041`);
    });
  }
}
