import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

// Add middleware to all routes

const router = express.Router();

router.use(authenticateToken);

// POST --- CREATE expense
router.post("/", async (req, res) => {
  try {
    const { category_id, amount, description, expense_date } = req.body;

    // Get user from JWT
    const user_id = req.user.id;

    // Basic validation
    if (!amount || !expense_date) {
      return res
        .status(400)
        .json({ error: "amount and expense_date are required" });
    }

    const result = await pool.query(
      `INSERT INTO expenses (user_id, category_id, amount, description, expense_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, category_id || null, amount, description || null, expense_date],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET -- READ all expenses for a user
// GET -- READ expenses with filters and pagination
// GET -- READ expenses
router.get("/", async (req, res) => {
  try {
    const {
      category_id,
      start_date,
      end_date,
      limit,
      offset,
      sort_by,
      sort_order,
    } = req.query;
    const user_id = req.user.id; // taken from JWT

    let query = `
      SELECT 
    e.id,
    e.user_id,
    e.category_id,
    e.amount,
    e.description,
    e.expense_date,
    e.created_at,
    e.updated_at,
    c.name AS category_name,
    c.color
  FROM expenses e
  LEFT JOIN categories c ON e.category_id = c.id
  WHERE e.user_id = $1
    `;

    const params = [user_id];
    let paramIndex = 2;

    // Filters
    if (category_id) {
      query += ` AND e.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }
    if (start_date) {
      query += ` AND e.expense_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    if (end_date) {
      query += ` AND e.expense_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    // Sorting
    const allowedSort = ["expense_date", "amount", "created_at"];
    const sortColumn = allowedSort.includes(sort_by) ? sort_by : "expense_date";
    const sortDirection = sort_order === "asc" ? "ASC" : "DESC";
    query += ` ORDER BY e.${sortColumn} ${sortDirection}`;

    // Pagination
    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(Number(limit));
      paramIndex++;
    }
    if (offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(Number(offset));
      paramIndex++;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT -- UPDATE expense
router.put("/:id", async (req, res) => {
  try {
    const expenseId = req.params.id;
    const user_id = req.user.id;

    const { category_id, amount, description, expense_date } = req.body;

    // Check if expense belongs to user
    const existing = await pool.query(
      "SELECT * FROM expenses WHERE id = $1 AND user_id = $2",
      [expenseId, user_id],
    );

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Expense not found or unauthorized" });
    }

    const result = await pool.query(
      `UPDATE expenses
       SET category_id = $1,
           amount = $2,
           description = $3,
           expense_date = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [
        category_id || null,
        amount,
        description || null,
        expense_date,
        expenseId,
      ],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  try {
    const expenseId = req.params.id;
    const user_id = req.user.id;

    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
      [expenseId, user_id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Expense not found or unauthorized" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;
