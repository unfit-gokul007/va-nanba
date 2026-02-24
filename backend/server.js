require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));



app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/upload", require("./routes/upload"));



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));


app.listen(5000, () => console.log("Server running on 5000"));