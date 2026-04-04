const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/complaints")
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

const complaintsRoute = require("./routes/complaints");
app.use("/api/complaints", complaintsRoute);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});