const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAllTasks,
  getTasksByStudent,
  createTask,
  toggleDone,
  deleteTask,
} = require("../controllers/taskController");

router.use(protect);

router.get("/", getAllTasks);
router.get("/student/:studentId", getTasksByStudent);
router.post("/", createTask);
router.patch("/:id/toggle", toggleDone);
router.delete("/:id", deleteTask);

module.exports = router;
