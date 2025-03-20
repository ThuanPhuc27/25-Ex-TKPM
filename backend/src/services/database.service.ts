// External Dependencies
import dotenv from "dotenv";
import logger from "../logger";
import mongoose from "mongoose";

// Initialize Connection
export const connectToDatabase = async () => {
  dotenv.config();

  const connectionString = process.env.DB_CONNECTION_STRING;
  const databaseName = process.env.DB_NAME;
  if (!connectionString) {
    throw new Error(
      "DB_CONNECTION_STRING is not defined in the environment variables"
    );
  }
  if (!databaseName) {
    throw new Error("DB_NAME is not defined in the environment variables");
  }

  mongoose.connect(connectionString, {
    dbName: databaseName,
    // I don't know what these are, but I see it in [https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/]
    retryWrites: true,
    w: "majority",
  });

  logger.info(
    `[server]: Successfully connected to the database and its collections`
  );
};
