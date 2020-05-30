//connecting to data base
//user model implemented in this file

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/trade-manager",{
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// })

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  cards: {
    type: [Object],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("find", function (next) {
  this.populate("friends");
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  this._update.friends = [...doc.friends, this._update.friends];
  next();
});

userSchema.pre("save", async function (next) {
  const user = this;
  var cards = await user.db.collection("cards").find({}).toArray();
  var ncards = [];
  console.log(cards);
  for (let x = 0; x < 10; x++) {
    let num = Math.random() * cards.length;
    ncards.push(cards[Math.floor(num)]);
  }
  user.cards = ncards;
  next();
});

const User = mongoose.model("users", userSchema);
exports.User = User;

// const me = new User({
//     username: 'Nameer',
//     password: '12345'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })
// function validateUser(user) {
//     const schema = {

//     };
//     return Joi.validate(user, schema);
// }
// ------------------------ USER MODULES ---------------------------

// exports.validate = validateUser;
