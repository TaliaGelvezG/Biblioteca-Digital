const express = require("express");
const router = express.Router();
const Loan = require("../model/loan.js")

router.get("/", async(req, res)=>{
    const loanList = await Loan.find();
    return res.json(loanList);
})

router.get("/:id", async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  return res.json(loan);
});

router.post("/", (req, res) => {
  const loan = req.body;
  Loan.create(loan)
    .then((loan) => {
      console.log("loan created: ", loan);
      return res.status(201).json(loan);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

router.patch("/:id", (req, res) => {
  const loanBody = req.body;
  Loan.findByIdAndUpdate(req.params.id, loanBody, { new: true })
    .then((loan) => {
      console.log("loan updated: ", loan);
      return res.json(loan);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

router.delete("/:id", (req, res) => {
  Loan.findByIdAndDelete(req.params.id)
    .then((loan) => {
      console.log("loan deleted: ", loan);
      return res.json(loan);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

module.exports = router