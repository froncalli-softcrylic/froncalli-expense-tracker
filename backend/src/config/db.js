import { neon } from "@neondatabase/serverless";

import "dotenv/config";

// CREATES A SQL CONNECTION USING OUR DATABASE URL
export const sql = neon(process.env.DATABASE_URL);

// Initialize the database and create the transactions table if it doesn't exist
// This function is called once when the server starts
export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE)`;

    // DECIMAL(10, 2) means 10 digits in total, with 2 after the decimal point
    // The max value for amount is 99999999.99 (9 digits before the decimal point and 2 after)

    console.log("Database initialized successfully.");
  } catch (error) {
    console.log("Error initializing database:", error);
    process.exit(1); // status code 1 means failuer, 0 means success
  }
}
