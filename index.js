
import "dotenv/config";
import express from "express";
import { connectDB } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "MongoDB Library API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: "MongoDB",
  });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.error("Server could not start");
  });
