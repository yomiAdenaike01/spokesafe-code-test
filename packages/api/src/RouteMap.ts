import { Router } from "express";

interface Route {
  url: string;
  router: Router;
}
export class RouteMap {
  url: string;
  router: Router;
  constructor(url: string, router: Router) {
    this.url = url;
    this.router = router;
  }
}
