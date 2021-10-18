import { calculateCredits } from "../../utils/calculate-credits";
import { User } from "./../user/user.model";
import {
  prop,
  getModelForClass,
  ReturnModelType,
  Ref,
} from "@typegoose/typegoose";
import { EBookingStatus } from "@spokesafe/types";
export class Booking {
  @prop({ type: Date, default: null })
  cancelled_datetime!: Date;
  @prop({
    type: String,
    enum: [
      EBookingStatus.ONGOING,
      EBookingStatus.SCHEDULED,
      EBookingStatus.CANCELLED,
      EBookingStatus.COMPLETED,
      EBookingStatus.DEFERRED,
    ],
    default: EBookingStatus.SCHEDULED,
  })
  status!: string;
  @prop({ ref: () => User })
  assigned_user?: Ref<User>;
  @prop({ type: Date })
  scheduled_start_datetime!: Date;
  @prop({ type: Date })
  scheduled_end_datetime!: Date;
  public static async findByIdAndCalculateCredits(
    this: ReturnModelType<typeof Booking>,
    id: string
  ) {
    const b = await this.findById(id).exec();
    if (b) {
      return calculateCredits(
        b.scheduled_start_datetime,
        b.scheduled_end_datetime
      );
    } else {
      return 0;
    }
  }
}
export const BookingModel = getModelForClass(Booking);
