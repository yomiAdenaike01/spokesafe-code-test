import { calculateCredits } from "./../../utils/calculate-credits";
import { EBookingStatus } from "@spokesafe/types";
import { userController } from "./../user/user.controller";
import { bookingController } from "./booking.controller";
import { dbManager } from "./../database/database.service";
import { add, sub } from "date-fns";
import { BookingModel } from "./booking.model";
import { UserModel } from "../user/user.model";
describe("[booking-controller-test]", () => {
  // Start database
  let userId = "";
  let bookingId = "";
  beforeAll(async () => {
    await dbManager.connectToTestDatabase();
    userId = await userController.createTestUser();
  });
  // Remove database and remove users
  afterAll(async () => {
    dbManager.disconnectFromDatabase();
  });
  it("should get all bookings", async () => {
    const bookings = await bookingController.getBookings();
    expect(bookings).toBeDefined();
    expect(bookings.length).toBeGreaterThan(0);
  });
  it("should schedule a booking and add credits to users account", async () => {
    const userBeforeBooking = await userController.getUserById(userId);
    const res = await bookingController.scheduleBooking(
      userId,
      +new Date(),
      +add(new Date(), { minutes: 40 })
    );
    const userAfterBooking = await userController.getUserById(userId);
    expect(userAfterBooking?.credits as number).toBeGreaterThan(
      userBeforeBooking?.credits as number
    );
    const _x = await BookingModel.findById(res);

    expect(_x).not.toBeNull();
    expect(res).toBeDefined();
    expect(res.length).toBeGreaterThan(0);
    bookingId = res;
  });
  it("should activate/start a booking", async () => {
    const id = await bookingController.startBooking(
      bookingId,
      sub(new Date(), { hours: 2 })
    );
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
    const res = await BookingModel.findById(bookingId);
    expect(res).toBeDefined();
    expect(res!.status).toBe(EBookingStatus.ONGOING);
  });
  it("should complete calculate credits and return a number", async () => {
    await BookingModel.findByIdAndUpdate(bookingId, {
      end_datetime: add(new Date(), { minutes: 60 }),
    });
    const res = await BookingModel.findByIdAndCalculateCredits(bookingId);
    expect(res).toBeDefined();
    expect(res).toBeGreaterThan(0);
  });
  it("should cancel an active booking and revoke credits from users account", async () => {
    const userBeforeCancelling = await userController.getUserById(userId);
    await bookingController.cancelBooking(bookingId);
    const userAfterCancelling = await userController.getUserById(userId);
    expect(userAfterCancelling?.credits as number).toBeLessThan(
      userBeforeCancelling?.credits as number
    );
  });
});
