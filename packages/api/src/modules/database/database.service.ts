import mongoose, { connect, connection } from "mongoose";
import { GlobalException } from "../../utils/exceptions/global.exception";
import dotenv from "dotenv";
export class DatabaseManager {
  connection: typeof mongoose | null;
  constructor() {
    dotenv.config();
    this.connection = null;
  }
  /**
   * @description Connects to database based on name
   * @param databaseName
   */
  async connectToDatabase() {
    try {
      this.connection = await connect(process.env.MONGO_URL as string);
    } catch (error) {
      throw new GlobalException("Failed to connect to database", 0, error);
    }
  }
  async disconnectFromDatabase() {
    try {
      await this.connection?.disconnect();
      await connection.close();
    } catch (error) {
      throw new Error(error as any);
    }
  }

  async connectToTestDatabase() {
    try {
      await this.connectToDatabase();
    } catch (error) {
      throw new Error(error as any);
    }
  }
}
export const dbManager = new DatabaseManager();
