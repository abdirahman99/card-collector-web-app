//authenticate function to control which routes to be accessed by which users

const jwt = require("jsonwebtoken");
const { User } = require("../db/mongoose");

const auth = async (req, res, next) => {
  try {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWEwM2VmNjBmYTJkNzI3MjhiM2M2MDciLCJpYXQiOjE1ODc2OTY2MTQsImV4cCI6MTU4ODMwMTQxNH0.w3zVNlEEpvvVJ0L5FK2CFX-bZUcAeHEchvYI1V6rnBo'
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, "thisismytoken");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
