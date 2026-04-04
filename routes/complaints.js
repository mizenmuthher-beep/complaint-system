const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newComplaint = new Complaint({
      name: req.body.name,
      phone: req.body.phone,
      description: req.body.description,
      image: req.file ? req.file.filename : null
    });

    await newComplaint.save();
    res.json("Complaint submitted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const data = await Complaint.find();
  res.json(data);
});

module.exports = router;