const File = require("../models/File");
const fs = require("fs");
const path = require("path");

exports.uploadFile = async (req, res) => {
  try {
    const newFile = new File({
      user: req.user.id || req.user.userId,
      filename: req.file.filename,
      originalname: req.file.originalname
    });

    await newFile.save();

    res.json(newFile);
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.find({
      user: req.user.id || req.user.userId
    });

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Error fetching files" });
  }
};



exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user.id || req.user.userId
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete from uploads folder
    const filePath = path.join(__dirname, "../uploads", file.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};