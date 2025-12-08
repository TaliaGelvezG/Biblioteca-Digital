
import Book from "../model/book.js";
import "./config/mongodb-connection-config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export const seedBooks = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const booksPath = path.resolve(__dirname, "books.json");
  let books = [];
  try {
    const data = fs.readFileSync(booksPath, "utf-8");
    books = JSON.parse(data);
  } catch (err) {
    console.error("No se pudo leer el archivo books.json:", err);
    return;
  }

  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany(books);
      console.log("Libros de ejemplo insertados en la base de datos.");
    } else {
      console.log("Ya existen libros en la base de datos. No se insertaron duplicados.");
    }
  } catch (error) {
    console.error("Error insertando libros de ejemplo:", error);
  }
};
