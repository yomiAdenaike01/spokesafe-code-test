import { UserModel } from "./user.model";
import { userController } from "./user.controller";
import { dbManager } from "./../database/database.service";

describe("complete booking and credit users account", () => {
  // Start database
  let userId = "";

  beforeAll(async () => {
    await dbManager.connectToTestDatabase();
    userId = await userController.createTestUser();
  });
  // Remove database and remove users
  afterAll(async () => {
    await userController.deleteUser(userId);
    await dbManager.disconnectFromDatabase();
  });

  it("should add credits to the users account", async () => {
    const res = await userController.addCredits(userId, 10);
    const user = await UserModel.findById(userId);
    expect(user).toBeDefined();
    expect(user!.credits).toBe(10);
  });
  it("should remove credits from users account", async () => {
    const res = await userController.revokeCredits(userId, 20);
    const user = await UserModel.findById(userId);
    expect(user).toBeDefined();
    expect(user!.credits).toBe(-10);
  });
});
