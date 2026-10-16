
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: String,
  genre: String,
  publishedYear: Number,
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
