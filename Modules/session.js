import session from "express-session";

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

export default sessionMiddleware;
