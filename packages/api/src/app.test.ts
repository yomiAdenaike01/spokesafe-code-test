import { UserRouter } from "./modules/user/user.router";
import { userController } from "./modules/user/user.controller";
import { bookingController } from "./modules/booking/booking.controller";
import { dbManager } from "./modules/database/database.service";
import request from "supertest";
import { Application } from "./Application";
import { RouteMap } from "./RouteMap";
import { BookingRouter } from "./modules/booking/booking.router";
import { add } from "date-fns";
const bookingRouter = new BookingRouter();
const userRouter = new UserRouter();

const app = new Application([
  new RouteMap(bookingRouter.getURL(), bookingRouter.getRouter()),
  new RouteMap(userRouter.getURL(), userRouter.getRouter()),
]);
let bookingId = "";
describe("App test", () => {
  let userId = "";
  beforeAll(async () => {
    await dbManager.connectToTestDatabase();
    userId = await userController.createTestUser();
    bookingId = await bookingController.scheduleBooking(
      userId,
      new Date(),
      add(new Date(), { minutes: 10 })
    );
  });
  test("GET /me", async () => {
    await request(app.getExpress())
      .get("/users/me")
      .send({ user_id: userId })
      .set("user_id", userId)
      .expect(200)
      .then((response) => {
        expect.assertions(5);
        // Check the response type and length
        expect(response.body).toBeDefined();
        expect(response.body.fname).toBeDefined();
        expect(response.body.lname).toBeDefined();
        expect(response.body._id).toBeDefined();
        expect(response.body.email).toBeDefined();
        return Promise.resolve();
      });
  });
  test("GET /bookings", async () => {
    await request(app.getExpress())
      .get("/bookings")
      .expect(200)
      .then((response) => {
        expect.assertions(2);
        // Check the response type and length
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBeTruthy();
        return Promise.resolve();
      });
  });
  test("POST /bookings", async () => {
    await request(app.getExpress())
      .post("/bookings")
      .send({
        user_id: userId,
        start: +new Date(),
        end: +add(new Date(), { hours: 3 }),
      })
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(response.body).toBeDefined();
        expect(response.body.length).toBeGreaterThan(0);
        return Promise.resolve();
      });
  });
  test("PATCH /bookings", async () => {
    await request(app.getExpress())
      .patch("/bookings")
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(response.body).toBeTruthy();
        return Promise.resolve();
      });
  });
  test("POST /bookings/cancel", async () => {
    await request(app.getExpress())
      .post("/bookings/cancel")
      .send({ booking_id: bookingId })
      .expect(200)
      .then((response) => {
        // Check the response type and length
        expect(response.body).toBeDefined();
        expect(response.body.bookingId).toBeDefined();
        expect(response.body.bookingId.length).toBeGreaterThan(0);
        expect(response.body.credits).toBeDefined();

        expect(typeof response.body === "object").toBeTruthy();
        return Promise.resolve();
      });
  });
});
