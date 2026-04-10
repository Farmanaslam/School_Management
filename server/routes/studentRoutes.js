const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAllStudents,
  addStudent,
  updateStudent,
  removeStudent,
} = require("../controllers/studentController");

router.use(protect); // all student routes need login

router.get("/", getAllStudents);
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", removeStudent);

module.exports = router;
