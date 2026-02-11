import express from "express";
import bodyParser from "body-parser";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { readPosts, writePosts, addPost } from "./Modules/PostsHandler.js";
import sessionMiddleware from "./Modules/session.js";
import { readUsers, writeUsers, addUser, validateUser } from "./Modules/validationUser.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

app.get("/", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
  } else {
    let posts = await readPosts();
    res.render("index.ejs", { posts });
  }
});

app.get("/add-post", (req, res) => {
  res.render("addpost.ejs");
});

app.post("/add-post", (req, res) => {
  let { title, content } = req.body;
  const author = req.session.user ? req.session.user.username : "Anonymous";
  const date = new Date();
  const id = Date.now().toString();
  addPost({ id, title, content, author, date });
  res.redirect("/");
});

app.get("/post/:id", async (req, res) => {
  const posts = await readPosts();
  const post = posts.find((p) => p.id === req.params.id);
  if (post) {
    res.render("post.ejs", { post });
  } else {
    res.redirect("/");
  }
});

app.get("/login", (req, res) => {
  res.render("Login.ejs");
});

app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  const user = await validateUser(username, password);
  if (user) {
    req.session.isLoggedIn = true;
    req.session.user = user;
    if (user.role === "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/admin", (req, res) => {
  if (req.session.isLoggedIn && req.session.user && req.session.user.role === "admin") {
    res.render("admin.ejs");
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  let { username, password, email } = req.body;
  await addUser({ username, password, email });
  res.redirect("/login");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
