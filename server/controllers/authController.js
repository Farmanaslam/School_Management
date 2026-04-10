const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: "All fields required" });

    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ msg: "Username already taken" });

    const admin = await Admin.create({ username, password });
    res.status(201).json({
      token: makeToken(admin._id),
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// POST /api/auth/login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ msg: "All fields required" });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const ok = await admin.checkPassword(password);
    if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      token: makeToken(admin._id),
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { registerAdmin, loginAdmin };
