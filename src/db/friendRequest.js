const mongoose = require("mongoose");

const FriendRequests = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  status: {
    type: String,
    enum: ["accepted", "declined", "pending"],
    default: "pending",
  },
});

FriendRequests.pre("find", function (next) {
  this.populate("sender").populate("recipient");
  next();
});

module.exports = mongoose.model("friendrequests", FriendRequests);
