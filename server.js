const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* =========================
   DATABASE CONNECTION
========================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "complaints_system"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

/* =========================
   FILE UPLOAD (MULTER)
========================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

/* =========================
   ADD COMPLAINT (SECURE)
========================= */
app.post("/api/complaints", upload.single("file"), (req, res) => {
  const { name, phone, description } = req.body;
  const file = req.file ? req.file.filename : null;

  if (!name || !phone || !description) {
    return res.status(400).json({ error: "All fields required" });
  }

  const sql = `
    INSERT INTO complaints (name, phone, description, file_path)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, phone, description, file], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({
      message: "تم إرسال الشكوى ✅",
      id: result.insertId
    });
  });
});

/* =========================
   GET ALL COMPLAINTS
========================= */
app.get("/api/complaints", (req, res) => {
  db.query("SELECT * FROM complaints ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

/* =========================
   GET ONE COMPLAINT
========================= */
app.get("/api/complaint/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM complaints WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

/* =========================
   ADMIN LOGIN
========================= */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "خطأ في تسجيل الدخول" });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});