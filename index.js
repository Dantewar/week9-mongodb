
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
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

// GET book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        error: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch book",
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

// PUT update book
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        error: "Invalid book ID",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to update book",
    });
  }
});

// DELETE book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        error: "Invalid book ID",
      });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete book",
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
