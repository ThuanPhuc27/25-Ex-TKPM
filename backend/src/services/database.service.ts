// External Dependencies
import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { Student } from "@models/student";

// Global Variables
export const collections: { students?: Collection<Student> } = {};

// Initialize Connection
export const connectToDatabase = async () => {
  dotenv.config();

  const connectionString = process.env.DB_CONNECTION_STRING;
  const databaseName = process.env.DB_NAME;
  const studentCollectionName = process.env.DB_STUDENT_COLLECTION_NAME;
  if (!connectionString) {
    throw new Error(
      "DB_CONNECTION_STRING is not defined in the environment variables"
    );
  }
  if (!databaseName) {
    throw new Error("DB_NAME is not defined in the environment variables");
  }
  if (!studentCollectionName) {
    throw new Error(
      "DB_STUDENT_COLLECTION_NAME is not defined in the environment variables"
    );
  }

  const client: MongoClient = new MongoClient(connectionString);
  await client.connect();

  const db: Db = client.db(databaseName);

  collections.students = db.collection(studentCollectionName);

  console.log(
    `[server]: Successfully connected to the database and its collections`
  );
};
