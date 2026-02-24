const Note = require("../models/Note");
const PDFDocument = require("pdfkit");

exports.createNote = async (req, res) => {
  const note = await Note.create({
    user: req.user.id,
    title: req.body.title,
    content: req.body.content,
     file: req.file ? req.file.filename : null 
  });
  res.json(note);
};


// GET SINGLE NOTE
exports.getSingleNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching note" });
  }
};


// UPDATE NOTE
exports.updateNote = async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};




exports.getNotes = async (req, res) => {
  const search = req.query.search;

  let query = { user: req.user.id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];
  }

  const notes = await Note.find(query).sort({ createdAt: -1 });
  res.json(notes);
};

exports.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};

exports.convertToPDF = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id, // important for security
    });

    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${note.title}.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(20).text(note.title);
    doc.moveDown();
    doc.fontSize(14).text(note.content);

    doc.end();

  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ msg: "PDF generation failed" });
  }
};