import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// Middleware Section
app.use(rateLimiter);
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

// GETS ALL TRANSACTIONS FOR A SPECIFIC USER
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.log(`Error getting the transactions: ${error}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

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
    RETURNING *
    `;

    console.log("Transaction created:", transaction[0]);
    res.status(201).json(transaction[0]); // Return the created transaction
  } catch (error) {
    console.log(`Error creating the transaction: ${error}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

// DELETE A TRANSACTION BY ID
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }
    const result = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    console.log(`Error deleting the transaction: ${error}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

// GETS A SUMMARY OF TRANSACTIONS FOR A SPECIFIC USER
app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
    SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].income,
    });
  } catch (error) {
    console.log(`Error getting the summary: ${error}`);
    res.status(500).json({ message: "Internal server error." });
  }
});

console.log("My port:", process.env.PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
