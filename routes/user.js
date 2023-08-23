const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/user");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  const dbUser = await User.findOne({ email });

  const isPasswordSame = await bcrypt.compare(password, dbUser.password);

  if (!isPasswordSame) {
    res.status(401).send({ message: "Password is incorrect" });
    return;
  }

  const token = jwt.sign(
    { email: dbUser.email, role: dbUser.role },
    process.env.JWT_SECRET
  );
  res.send({ token });
});

router.post("/register", async (req, res) => {
  const user = req.body;
  user.password = await bcrypt.hash(user.password, 10);
  const dbUser = await User.create(user);
  res.send(dbUser);
});

module.exports = router;
