import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("form", { error: null });
});

app.post("/calculate", (req, res) => {
  const { source1, source2 } = req.body;

  const n1 = parseFloat(source1);
  const n2 = parseFloat(source2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.render("form", { error: "⚠️ Please enter valid numbers for both sources." });
  }

  const totalIncome = n1 + n2;
  res.render("result", { source1: n1, source2: n2, totalIncome });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Tax Form running at http://localhost:${port}`);
});
