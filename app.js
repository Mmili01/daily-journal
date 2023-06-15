//jshint esversion:6
//requiring the necessary packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//connection string for the database
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err, err.message);
  });

//creating a new schema
const journalSchema = new mongoose.Schema({
  titleBody: String,
  bodyPost: String,
});

const Scribbles = mongoose.model("Scribbles", journalSchema);

// let posts = [];

// get request for the home route
app.get("/", function (req, res) {
  Scribbles.find({})
    .then((posts) => {
      console.log(posts);
      res.render("home", {
        StartingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//get request for the about page
app.get("/about", function (req, res) {
  res.render("about", { aboutContents: aboutContent });
});

// get request for the contact page
app.get("/contact", function (req, res) {
  res.render("contact", { contactContents: contactContent });
});

//get request for the compose
app.get("/compose", function (req, res) {
  res.render("compose");
});

//post request for the compose
app.post("/compose", function (req, res) {
  let post = new Scribbles({
    titleBody: req.body.newpost,
    bodyPost: req.body.Text1,
  });
  if (post.titleBody !== "" && post.bodyPost !== "") {
    post
      .save()
      .then(() => {
        console.log("saved to database");
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//get request for the dynamically generated topic
app.get("/post/:postID", function (req, res) {
  // const requestedname = _.lowerCase(req.params.topic);
  const requestedPostID = req.params.postID;
  Scribbles.findOne({ _id: requestedPostID })
    .then((post) => {
      if (post) {
        console.log(requestedPostID);
        res.render("post", {
          titleBody: post.titleBody,
          bodyPost: post.bodyPost,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

// app.get("/", function (req, res) {
//   var today = new Date();
//   var currentDay = today.getDay();
//   var options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//   };

//   var day = today.toLocaleDateString("en-US", options);

//   res.render("list", {
//     listTitle: day,
//   });
// });

// posts.forEach(function (post) {
//   let storedTitle = _.lowerCase(post.titleBody);
//   if (requestedname === storedTitle) {
//     console.log("Match found");
//     res.render("/post", {
//       title: post.titleBody,
//       body: post.bodyPost,
//     });
//   }
// });

// res.render("home", {
//   StartingContent: homeStartingContent,
//   postArrays: ,
// });
