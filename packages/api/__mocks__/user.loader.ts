import faker from "faker";
import type { IBooking, IUser, TBookingStatus } from "@spokesafe/types";
import { add } from "date-fns";
// NEED TO DELETE
export const USERS = loadUsers(10);
export const BOOKINGS = loadBookings(USERS, 10);
export const TRANSACTIONS = loadTransactions(BOOKINGS, 10);
function createArrayFromNum<T>(count: number, cb: (i?: number) => T): T[] {
  return Array.from({ length: count }).map((x, i) => {
    return cb(i);
  });
}
function pickFromObject<T>(obj: T, key: keyof T | (keyof T)[]) {
  return typeof key === "string"
    ? obj[key]
    : Array.isArray(key)
    ? key.reduce((ac, c) => {
        ac[c] = obj[c];
        return ac;
      }, {} as Partial<T>)
    : "";
}
function pickRandomFromArray<T>(arr: T[]): T {
  return arr[Math.random() * arr.length];
}
function toISO(date: Date) {
  return date.toISOString();
}
function mongooseId() {
  return require("mongoose").Types.ObjectId() as string;
}
export function loadBookings(users: IUser[], num = 5) {
  const scheduledStart = new Date();
  const scheduledEnd = add(scheduledStart, { days: 1 });
  const start = scheduledStart;
  const end = faker.date.between(scheduledStart, scheduledEnd);
  const user = pickRandomFromArray(users);
  return createArrayFromNum<IBooking>(num, () => ({
    _id: mongooseId(),
    createdAt: toISO(new Date()),
    assigned_user_id: String(pickFromObject(user, "_id")),
    updatedAt: toISO(end),
    scheduled_end_datetime: toISO(scheduledEnd),
    start_datetime: toISO(start),
    end_datetime: toISO(end),
    scheduled_start_datetime: toISO(scheduledStart),
    assigned_user: pickFromObject(user, [
      "_id",
      "email",
      "fname",
      "lname",
    ]) as Partial<IUser>,
    status: pickRandomFromArray([
      "cancelled",
      "completed",
      "deferred",
      "ongoing",
    ] as TBookingStatus[]),
  }));
}
export function loadTransactions(bookings: IBooking[], num = 5) {}
export function loadUsers(num = 5): IUser[] {
  return Array.from({ length: num }).map((x) => {
    return {
      fname: faker.name.firstName(),
      lname: faker.name.lastName(),
      credits: faker.random.number(),
      email: faker.internet.email(),
    } as IUser;
  });
}
