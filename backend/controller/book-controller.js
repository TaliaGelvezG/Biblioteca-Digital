const express = require("express");
const router = express.Router();
const Book = require("../model/book.js")

router.get("/", async(req, res)=>{
    const bookList = await Book.find();
    return res.json(bookList);
})

router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  return res.json(book);
});

router.post("/", (req, res) => {
  const book = req.body;
  Book.create(book)
    .then((book) => {
      console.log("book created: ", book);
      return res.status(201).json(book);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

router.patch("/:id", (req, res) => {
  const bookBody = req.body;
  Book.findByIdAndUpdate(req.params.id, bookBody, { new: true })
    .then((user) => {
      console.log("book updated: ", user);
      return res.json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

router.delete("/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then((book) => {
      console.log("book deleted: ", book);
      return res.json(book);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

module.exports = router