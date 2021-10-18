export interface IUser {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  credits: number;
}

export enum EBookingStatus {
  ONGOING = "ongoing",
  SCHEDULED = "scheduled",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  DEFERRED = "deferred",
}
export interface IBooking {
  _id: string;
  scheduled_start_datetime: Date;
  scheduled_end_datetime: Date;
  start_datetime: Date;
  end_datetime: Date;
  assigned_user: Partial<IUser>;
  status: EBookingStatus;
}
