const Task = require("../models/Task");

// GET /api/tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "fullName rollNo classSection")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ msg: "Could not load tasks" });
  }
};

// GET /api/tasks/student/:studentId
const getTasksByStudent = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.studentId })
      .populate("assignedTo", "fullName rollNo classSection")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ msg: "Failed to get tasks" });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, subject, dueDate, assignedTo } = req.body;
    if (!title || !subject || !assignedTo)
      return res.status(400).json({ msg: "Title, subject and student required" });

    const t = await Task.create({ title, description, subject, dueDate, assignedTo });
    const populated = await t.populate("assignedTo", "fullName rollNo classSection");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ msg: "Task creation failed" });
  }
};

// PATCH /api/tasks/:id/toggle
const toggleDone = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ msg: "Task not found" });
    t.isDone = !t.isDone;
    await t.save();
    await t.populate("assignedTo", "fullName rollNo classSection");
    res.json(t);
  } catch {
    res.status(500).json({ msg: "Toggle failed" });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const t = await Task.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
};

module.exports = { getAllTasks, getTasksByStudent, createTask, toggleDone, deleteTask };
