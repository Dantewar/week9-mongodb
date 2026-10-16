
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import Book from "./models/Book.js";
import Author from "./models/Author.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const isValidId = (id) => mongoose.isObjectIdOrHexString(id);

const handleError = (error, res) => {
  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
};

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

// GET books with filtering, sorting, pagination and author
app.get("/books", async (req, res) => {
  try {
    const { genre, sort } = req.query;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        error: "Invalid page or limit",
      });
    }

    if (
      genre !== undefined &&
      (typeof genre !== "string" ||
        !["fantasy", "dystopian", "children", "classic"].includes(genre))
    ) {
      return res.status(400).json({
        error: "Invalid genre",
      });
    }

    if (
      sort !== undefined &&
      sort !== "publishedYear" &&
      sort !== "-publishedYear"
    ) {
      return res.status(400).json({
        error: "Invalid sort value",
      });
    }

    const filter = genre ? { genre } : {};

    const sortOption =
      sort === "-publishedYear"
        ? { publishedYear: -1, _id: 1 }
        : { publishedYear: 1, _id: 1 };

    const total = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .populate("author")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      data: books,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// GET book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        error: "Invalid book ID",
      });
    }

    const book = await Book.findById(id).populate("author");

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    handleError(error, res);
  }
});

// POST create book
app.post("/books", async (req, res) => {
  try {
    if (req.body.author !== undefined) {
      if (!isValidId(req.body.author)) {
        return res.status(400).json({
          error: "Invalid author ID",
        });
      }

      const author = await Author.findById(req.body.author);

      if (!author) {
        return res.status(404).json({
          error: "Author not found",
        });
      }
    }

    const book = new Book(req.body);
    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    handleError(error, res);
  }
});

// PUT update book
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        error: "Invalid book ID",
      });
    }

    if (req.body.author !== undefined) {
      if (!isValidId(req.body.author)) {
        return res.status(400).json({
          error: "Invalid author ID",
        });
      }

      const author = await Author.findById(req.body.author);

      if (!author) {
        return res.status(404).json({
          error: "Author not found",
        });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("author");

    if (!updatedBook) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    handleError(error, res);
  }
});

// DELETE book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
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
    handleError(error, res);
  }
});

// GET all authors
app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find();

    res.status(200).json(authors);
  } catch (error) {
    handleError(error, res);
  }
});

// POST create author
app.post("/authors", async (req, res) => {
  try {
    const author = new Author(req.body);
    const savedAuthor = await author.save();

    res.status(201).json(savedAuthor);
  } catch (error) {
    handleError(error, res);
  }
});

// GET books by author ID
app.get("/authors/:id/books", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        error: "Invalid author ID",
      });
    }

    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).json({
        error: "Author not found",
      });
    }

    const books = await Book.find({
      author: id,
    }).populate("author");

    res.status(200).json({
      author,
      books,
    });
  } catch (error) {
    handleError(error, res);
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
