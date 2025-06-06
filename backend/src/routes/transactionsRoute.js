import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  getTransactionSummary,
} from "../controllers/transactionsController.js";

const router = express.Router();

// GETS ALL TRANSACTIONS FOR A SPECIFIC USER
router.get("/:userId", getTransactionsByUserId);

// CREATE A NEW TRANSACTION TO THE DATABASE
router.post("/", createTransaction);

// DELETE A TRANSACTION BY ID
router.delete("/:id", deleteTransaction);

// GETS A SUMMARY OF TRANSACTIONS FOR A SPECIFIC USER
router.get("/summary/:userId", getTransactionSummary);

export default router;
