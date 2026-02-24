const router = require("express").Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const controller = require("../controllers/fileController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", auth, upload.single("file"), controller.uploadFile);
router.get("/", auth, controller.getFiles);
router.delete("/:id", auth, controller.deleteFile);

module.exports = router;