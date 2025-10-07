import express from "express";
import session from "express-session";
import path from "path";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.static("public"));

// Set EJS as template engine
app.set("view engine", "ejs");

// Session setup
app.use(session({
  secret: "library_secret_key", // secret for session encryption
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 min session
}));

// Routes
app.get("/", (req, res) => {
  if (req.session.username) {
    return res.redirect("/profile");
  }
  res.redirect("/login");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Handle login
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.render("login", { error: "Please enter your name" });
  }

  // Create session
  req.session.username = username;
  req.session.loginTime = new Date().toLocaleString();
  res.redirect("/profile");
});

// Profile page
app.get("/profile", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }

  res.render("profile", {
    username: req.session.username,
    loginTime: req.session.loginTime
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send("Error logging out");
    }
    res.redirect("/login");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
