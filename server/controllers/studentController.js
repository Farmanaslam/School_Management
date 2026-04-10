const Student = require("../models/Student");

// GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const list = await Student.find().sort({ createdAt: -1 });
    res.json(list);
  } catch {
    res.status(500).json({ msg: "Could not fetch students" });
  }
};

// POST /api/students
const addStudent = async (req, res) => {
  try {
    const { fullName, rollNo, classSection, parentContact, email } = req.body;
    if (!fullName || !rollNo || !classSection)
      return res.status(400).json({ msg: "Name, roll no and class required" });

    const already = await Student.findOne({ rollNo });
    if (already)
      return res.status(400).json({ msg: "Roll number already used" });

    const s = await Student.create({ fullName, rollNo, classSection, parentContact, email });
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ msg: "Could not create student" });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!s) return res.status(404).json({ msg: "Student not found" });
    res.json(s);
  } catch {
    res.status(500).json({ msg: "Update failed" });
  }
};

// DELETE /api/students/:id
const removeStudent = async (req, res) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ msg: "Student not found" });
    res.json({ msg: "Student removed" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
};

module.exports = { getAllStudents, addStudent, updateStudent, removeStudent };
