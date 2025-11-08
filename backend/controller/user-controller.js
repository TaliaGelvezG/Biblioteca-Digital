const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");

router.get("/", async(req, res)=>{
    const userList = await User.find();
    return res.json(userList);
})

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json(user);
});

router.post("/register", (req, res) => {
  const user = req.body;
  User.create(user)
    .then((user) => {
      console.log("user created: ", user);
      return res.status(201).json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Unauthorized" });

    const token = jwt.sign({ email, rol : user.rol, userName: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/:id", (req, res) => {
  const userBody = req.body;
  User.findByIdAndUpdate(req.params.id, userBody, { new: true })
    .then((user) => {
      console.log("user updated: ", user);
      return res.json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

router.delete("/:id", (req, res) => {
  User
    .findByIdAndDelete(req.params.id)
    .then((user) => {
      console.log("user deleted: ", user);
      return res.json(user);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json(error);
    });
});

module.exports = router