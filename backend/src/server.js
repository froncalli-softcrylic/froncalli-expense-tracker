import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

// Middleware Section
app.use(rateLimiter);
// Without this line, the server won't be able to parse JSON request bodies
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Importing the url to the transactions route to use whenever the user accesses the /api/transactions endpoint
app.use("/api/transactions", transactionsRoute);

console.log("My port:", process.env.PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
