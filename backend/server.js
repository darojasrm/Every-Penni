import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import expensesRoutes from "./src/routes/expenses.js";
import authRoutes from "./src/routes/auth.js";
import categoriesRoutes from "./src/routes/categories.js";

dotenv.config();

const app = express();

/* const allowedOrigins = [
  "http://localhost:5173",
  "https://every-penni-git-main-daniel-alberto-rojas-barcos-projects.vercel.app/",
  "https://every-penni.vercel.app/",
]
 */
// MIDDLEWARE
/* app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
); */
app.use(
  cors({
    origin: true,
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
