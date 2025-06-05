import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
// Without this line, the server won't be able to parse JSON request bodies
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Initialize the database and create the transactions table if it doesn't exist
// This function is called once when the server starts
async function initDB() {
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

// CREATE A NEW TRANSACTION TO THE DATABASE
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const transaction = await sql`
    INSERT INTO transactions(user_id, title, amount, category)
    VALUES (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *`;

    console.log("Transaction created:", transaction[0]);
    res.status(201).json(transaction[0]); // Return the created transaction
  } catch (error) {
    console.log(`Error creating the transaction: ${error}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

console.log("My port:", process.env.PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
