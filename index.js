
import "dotenv/config";
import express from "express";
import { connectDB } from "./db.js";
import Book from "./models/Book.js";

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

// GET all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
});

// POST create book
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);

    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create book",
    });
  }
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
