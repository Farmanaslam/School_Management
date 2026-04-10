const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },
    classSection: { type: String, required: true },
    parentContact: { type: String, default: "" },
    email: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
