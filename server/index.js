const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://crud-operation-one-eta.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// MySQL Connection

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

function connectDB() {
    db.connect(err => {
        if (err) {
            console.error("❌ Database connection failed:", err);
            setTimeout(connectDB, 5000);
        }
        else {
            console.log("✅ Connected to MySQL database");
        }
    });
}
connectDB();

// ✅ API: Insert User
app.post("/users", (req, res) => {
  const { name, reg_no, dept, year, mail } = req.body;

  if (!name || !reg_no || !dept || !year || !mail) {
      return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO users (name, reg_no, dept, year, mail) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, reg_no, dept, year, mail], (err, result) => {
      if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ error: "Failed to insert user" });
      }
      res.json({ message: "User added successfully", userId: result.insertId });
  });
});

// ✅ API: Fetch All Users
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching users:", err);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
        res.json(result);
    });
});

// ✅ API: Delete User
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err){
          console.error("❌ Error deleting user:", err);
          return res.status(500).json({ error: "Failed to delete user" });
      }
      res.json({ message: "✅ User deleted successfully" });
  });
});

// ✅ API: Update User
app.patch("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, reg_no, dept, year, mail } = req.body;

    const sqlUpdate = "UPDATE users SET name = ?, reg_no = ?, dept = ?, year = ?, mail = ? WHERE id = ?";
    db.query(sqlUpdate, [name, reg_no, dept, year, mail, id], (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ error: "Failed to update user" });
        }
        res.json({ message: "User updated successfully" });
    });
});

// ✅ Serve frontend build
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
