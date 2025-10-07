import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Path setup (for ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve CSS

// GET home page
app.get("/", (req, res) => {
  res.render("index", { error: null });
});

// POST calculation
app.post("/calculate", (req, res) => {
  const { num1, num2, operation } = req.body;

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.render("index", { error: "❌ Please enter valid numbers!" });
  }

  let result;
  switch (operation) {
    case "add":
      result = n1 + n2;
      break;
    case "subtract":
      result = n1 - n2;
      break;
    case "multiply":
      result = n1 * n2;
      break;
    case "divide":
      if (n2 === 0) {
        return res.render("index", { error: "❌ Cannot divide by zero!" });
      }
      result = n1 / n2;
      break;
    default:
      return res.render("index", { error: "❌ Invalid operation!" });
  }

  res.render("result", { num1: n1, num2: n2, operation, result });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Calculator running at http://localhost:${port}`);
});
