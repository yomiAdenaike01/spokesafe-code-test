import { bookingController } from "./booking.controller";
import { Router } from "express";
interface IRouter {
  url: string;
  router: Router;
  startRoutes(): void;
  getRouter(): Router;
  getURL(): string;
}
export class BookingRouter implements IRouter {
  url: string;
  router: Router;
  constructor() {
    this.url = "/bookings";
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
    this.router.get("/", (req, res, next) => {
      bookingController
        .getBookings()
        .then((x) => {
          res.status(200).json(x);
        })
        .catch(next);
    });
    this.router.post("/", (req, res, next) => {
      bookingController
        .scheduleBooking(req.body.user_id, req.body.start, req.body.end)
        .then((x) => {
          res.status(200).json(x);
        })
        .catch(next);
    });
    this.router.patch("/", (req, res, next) => {
      bookingController
        .completeBooking(req.body.booking_id)
        .then((x) => {
          res.status(200).json(x);
        })
        .catch(next);
    });
    this.router.post("/cancel", (req, res, next) => {
      bookingController
        .cancelBooking(req.body.booking_id)
        .then((x) => {
          res.status(200).json(x);
        })
        .catch(next);
    });
  }
}
