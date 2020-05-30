const authentic = require("../src/middleware/authentic");
const { User } = require("../src/db/mongoose");
const auth = require("../routes/auth");
const users = require("../routes/users");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
require("../auth");



const bodyParser = require("body-parser");
// const hbs = require("hbs");

const app = express();
const publicDirectoryPath = path.join(__dirname, "../public");
//To set the handlebar template
app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

// for Static directory
app.use(express.static(publicDirectoryPath));
app.use(
  "/css",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
);

app.use(
  "/jquery",
  express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", users);
app.use("/api", auth);
app.use("/api/friends", require("../routes/friends"));

// app.get("/details", authentic, async (req, res) => {
//   try {
//     res.render("details", {
//       title: "Card Details",
//     });
//     const users = await User.find({});
//     res.send(users);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

app.get("/", (req, res) => {
  res.render("index", {
    title: "Card Trading Game",
  });
});

app.get("/signup", (req, res, next) => {
  res.render("signup", { title: "Card Trading Game" });
});
app.get("/login", (req, res, next) => {
  res.render("login", { title: "Card Trading Game" });
});

// // ---------------

// // //--------------

// app.get("/trade", (req, res) => {
//   res.render("trade", {
//     title: "Trade Request Description",
//   });
// });

// app.get("/signup", (req, res) => {
//   res.render("signup", {
//     title: "Sign Up",
//   });
// });
// app.get("/login", (req, res) => {
//   res.render("login", {
//     title: "Log In",
//   });
// });

//setting up a 404 page
app.get("*", (req, res) => {
  res.send("Error 404: Page not Found!");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/a5", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    mongoose.connection.db.createCollection("friendrequests");
    console.log(`Connected to MongoDB`);
  })
  .catch((err) => console.log(`Can't connect to MongoDB. Error ${err}`));

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
//------------------------

const jwt = require("jsonwebtoken");

const myFunction = async () => {
  const token = jwt.sign({ _id: "abc123" }, "thisismytoken", {
    expiresIn: "2 hours",
  });
  console.log(token);

  const data = jwt.verify(token, "thisismytoken");
  console.log(data);
};
