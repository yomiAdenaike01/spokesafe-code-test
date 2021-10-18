import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
  @prop({ required: true, type: String })
  fname!: string;
  @prop({ required: true, type: String })
  lname!: string;
  @prop({ required: true, type: String })
  email!: string;
  @prop({ default: 0, type: Number })
  credits!: number;
}
export const UserModel = getModelForClass(User);
