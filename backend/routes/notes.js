const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/noteController");
const multer = require("multer");

// 📁 Multer Storage Config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ✅ CREATE NOTE (WITH FILE UPLOAD)
router.post("/", auth, controller.createNote);

router.get("/", auth, controller.getNotes);

// ⚠️ IMPORTANT: keep pdf above :id
router.get("/pdf/:id", auth, controller.convertToPDF);

// GET SINGLE NOTE
router.get("/:id", auth, controller.getSingleNote);

// UPDATE NOTE
router.put("/:id", auth, controller.updateNote);

// DELETE NOTE
router.delete("/:id", auth, controller.deleteNote);

module.exports = router;