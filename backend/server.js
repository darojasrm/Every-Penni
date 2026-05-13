import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import expensesRoutes from "./src/routes/expenses.js";
import authRoutes from "./src/routes/auth.js";
import categoriesRoutes from "./src/routes/categories.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ROUTES
app.use("/expenses", expensesRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
