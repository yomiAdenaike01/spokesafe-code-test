import { dbManager } from "./modules/database/database.service";
import { RouteMap } from "./RouteMap";
import { Application } from "./Application";
import * as dotenv from "dotenv";
import { BookingRouter } from "./modules/booking/booking.router";
dotenv.config();
const bookingRouter = new BookingRouter();
dbManager.connectToDatabase();
new Application([
  new RouteMap(bookingRouter.getURL(), bookingRouter.getRouter()),
]).start();
