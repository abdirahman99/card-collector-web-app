//login authentication implemented here

const authentic = require("../src/middleware/authentic");
const { User } = require("../src/db/mongoose");
const express = require("express");
const router = express.Router();

console.log("2222");

router.post("/login", async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send("Incorrect username or password.");
  }

  // Then validate the Credentials in MongoDB match
  // those provided in the request

  validPassword = false;
  if (req.body.password == user.password) {
    validPassword = true;
  }

  if (!validPassword) {
    return res.status(400).send("Incorrect username or --password.");
  }
  const token = await user.generateAuthToken();
  // console.log(user)
  // console.log(token)
  res.send({ user, token });
});
console.log("3333");
module.exports = router;
