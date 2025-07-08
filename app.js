// ---------------------- Setting packages ---------------------->
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");

// Modularity -> Layouts & includes
const ejsMate = require("ejs-mate");

// Try catch
const wrapAsync = require("./utils/wrapAsync");

// Routing
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Session on Flash alearts
const session = require("express-session");
const flash = require("connect-flash");

// Authentication & Authorization
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Model/user.js");

// ---------------------- Session setting ---------------------->
const sessionOption = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// ---------------------- Middleware setup ---------------------->
// Session & flash
app.use(session(sessionOption));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------------------- Connection setup ---------------------->
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to Database......");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

// ------------------  Basic App Configuration ------------------>
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// ------------------------- API ROUTE ------------------------->
// Home Route
app.get(
  "/",
  wrapAsync((req, res) => {
    res.send("Hi, i am root");
  })
);

// Demo user
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser = await User.register(fakeUser, "fakePassword");
//   res.send(registeredUser);
// });

// Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ---------------------- Middlewares ---------------------->
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// ---------------------- Server Setup ---------------------->
app.listen(port, () => {
  console.log(`App is listning on port: ${port}`);
});
