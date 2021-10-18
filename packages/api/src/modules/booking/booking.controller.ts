import { calculateCredits } from "./../../utils/calculate-credits";
import { EBookingStatus } from "@spokesafe/types";
import { userController } from "./../user/user.controller";
import { InternalServerErrorExecption } from "./../../utils/exceptions/internal-server-error.exception";
import { BookingModel } from "./booking.model";
import { UserModel } from "../user/user.model";
class BookingController {
  /**
   * @description get all bookings
   */
  async getBookings() {
    try {
      const res = await BookingModel.find().lean();
      return res;
    } catch (error) {
      throw new InternalServerErrorExecption("Failed to get bookings", error);
    }
  }
  /**
   *
   * @param bid
   * @returns
   */
  async getBookingById(bid: string) {
    try {
      return await BookingModel.findById(bid);
    } catch (error) {
      throw new Error(error as any);
    }
  }
  /**
   * @name cancelBooking
   * @param bookingId
   * @returns user credits
   */
  async cancelBooking(bookingId: string) {
    try {
      const now = new Date();
      let credits = 0;
      const res = await BookingModel.findByIdAndUpdate(
        bookingId,
        {
          cancelled_datetime: now,
          status: EBookingStatus.CANCELLED,
        },
        {
          new: true,
        }
      ).lean();

      if (res?.assigned_user) {
        console.log({ res });
        const user = await userController.getUserById(
          String(res?.assigned_user)
        );
        if (user) {
          const creditsToRemove = calculateCredits(
            res!.scheduled_start_datetime,
            res!.scheduled_end_datetime
          );
          const newCredits =
            (user?.credits as number) - creditsToRemove < 0
              ? 0
              : (user?.credits as number) - creditsToRemove;
          const u = await UserModel.findByIdAndUpdate(
            user?._id,
            {
              credits: newCredits,
            },
            {
              new: true,
            }
          );
          if (u) credits = u.credits;
        }
      }
      return { bookingId: res?._id as string, credits };
    } catch (error) {
      throw new InternalServerErrorExecption("Failed to cancel booking", error);
    }
  }
  /**
   * @description Creates a booking
   * Adds to a transaction log
   * @param userId
   * @param start
   * @param end
   */
  async scheduleBooking(
    userId: string,
    start: string | number | Date,
    end: string | number | Date
  ) {
    try {
      const data: any = {
        assigned_user: userId,
        scheduled_end_datetime: end,
        scheduled_start_datetime: start,
      };

      const bookingModelRes = await new BookingModel(data).save();
      await userController.addCredits(
        userId,
        calculateCredits(
          bookingModelRes.scheduled_start_datetime,
          bookingModelRes.scheduled_end_datetime
        )
      );
      return String(bookingModelRes._id);
    } catch (error) {
      throw new InternalServerErrorExecption(
        "Failed to schedule booking",
        error
      );
    }
  }
  /**
   * @description Sets booking to completed
   * @param bookingId
   * @returns
   */
  async completeBooking(bookingId: string, completeDate?: Date) {
    try {
      const res = await BookingModel.findByIdAndUpdate(bookingId, {
        end_datetime: completeDate ? completeDate : new Date(),
        status: "completed",
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorExecption(
        "Failed to complete booking",
        error
      );
    }
  }
  /**
   * @name activateBooking
   * @param bookingId
   */
  async startBooking(bookingId: string, start?: Date) {
    try {
      const res = await BookingModel.findByIdAndUpdate(bookingId, {
        status: EBookingStatus.ONGOING,
        start_datetime: start ? start : new Date(),
      });
      return String(res?._id);
    } catch (error) {
      throw new InternalServerErrorExecption(
        "Failed to activate booking",
        error
      );
    }
  }
}
export const bookingController = new BookingController();
