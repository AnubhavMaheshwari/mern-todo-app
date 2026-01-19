const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Todo title is required"],
    trim: true,
    minlength: [1, "Title cannot be empty"],
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, "Category cannot exceed 50 characters"],
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Todo", todoSchema);
