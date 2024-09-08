import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use("/api/products", productRoutes);

connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error.message);
  });
