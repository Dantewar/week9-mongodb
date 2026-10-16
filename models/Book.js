
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },

    genre: {
      type: String,
      required: [true, "Book genre is required"],
      enum: {
        values: ["fantasy", "dystopian", "children", "classic"],
        message: "{VALUE} is not a valid genre",
      },
    },

    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [1000, "Published year must be at least 1000"],
      max: [2026, "Published year cannot be later than 2026"],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
