import express from "express";
import bodyParser from "body-parser";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { readPosts, writePosts, addPost } from "./Modules/PostsHandler.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  let posts = await readPosts();
  res.render("index.ejs", { posts });
});

app.get("/add-post", (req, res) => {
  res.render("addpost.ejs");
});

app.post("/add-post", (req, res) => {
  let { title, content } = req.body;
  addPost({ title, content });
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("Login.ejs");
});

app.post("/login", (req, res) => {
  let { username, password } = req.body;
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  let { username, password } = req.body;
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
