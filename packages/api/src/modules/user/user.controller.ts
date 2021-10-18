import { UserModel } from "./user.model";
import faker from "faker";
class UserController {
  async createTestUser() {
    const user = await new UserModel({
      fname: "yomi",
      lname: "adenaike",
      email: "adenaiekyomi@gmail.com",
      credits: 0,
    }).save();
    return String(user._id);
  }
  /**
   *
   * @param id
   * @returns
   */
  async getUserById(id: string) {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      throw new Error(error as any);
    }
  }
  /**
   *
   * @param id
   * @returns
   */
  async deleteUser(id: string) {
    try {
      await UserModel.findByIdAndDelete(id).lean();
      return true;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  /**
   * @depracated
   * @param userId
   * @param credits
   * @returns
   */
  async revokeCredits(userId: string, credits: number) {
    try {
      const user = await this.getUserById(userId);
      const _credits = user?.credits;
      const _c = (_credits || 0) - credits;
      await UserModel.findByIdAndUpdate(userId, {
        credits: _c,
      });
      return true;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  /**
   *
   * @param userId
   * @param credits
   * @returns
   */
  async addCredits(userId: string, credits: number) {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, {
        $inc: {
          credits,
        },
      });
      return true;
    } catch (error) {
      throw new Error(error as any);
    }
  }
}

export const userController = new UserController();
