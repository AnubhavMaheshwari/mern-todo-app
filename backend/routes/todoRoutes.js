const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: errors.array()
      }
    });
  }
  next();
};

// Get all todos with optional filtering and sorting
router.get(
  "/",
  [
    query("date").optional().isISO8601().withMessage("Invalid date format"),
    query("month").optional().matches(/^\d{4}-\d{2}$/).withMessage("Month must be in YYYY-MM format"),
    query("startDate").optional().isISO8601().withMessage("Invalid start date format"),
    query("endDate").optional().isISO8601().withMessage("Invalid end date format"),
    query("status").optional().isIn(["completed", "pending"]).withMessage("Status must be 'completed' or 'pending'"),
    query("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority level"),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { date, month, startDate, endDate, status, priority } = req.query;
      let filter = { user: req.user._id };

      // Filter by specific date
      if (date) {
        const targetDate = new Date(date);
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);
        filter.dueDate = { $gte: targetDate, $lt: nextDate };
      }

      // Filter by month
      if (month) {
        const [year, monthNum] = month.split("-");
        const startOfMonth = new Date(year, parseInt(monthNum) - 1, 1);
        const endOfMonth = new Date(year, parseInt(monthNum), 0, 23, 59, 59);
        filter.dueDate = { $gte: startOfMonth, $lte: endOfMonth };
      }

      // Filter by date range
      if (startDate && endDate) {
        filter.dueDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      // Filter by completion status
      if (status === "completed") {
        filter.completed = true;
      } else if (status === "pending") {
        filter.completed = false;
      }

      // Filter by priority
      if (priority) {
        filter.priority = priority;
      }

      const todos = await Todo.find(filter).sort({ dueDate: 1, createdAt: -1 });
      res.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({
        error: { message: "Failed to fetch todos", details: error.message }
      });
    }
  }
);

// Get monthly statistics
router.get("/stats/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const [year, monthNum] = month.split("-");

    const startOfMonth = new Date(year, parseInt(monthNum) - 1, 1);
    const endOfMonth = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

    const totalTodos = await Todo.countDocuments({
      user: req.user._id,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const completedTodos = await Todo.countDocuments({
      user: req.user._id,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      completed: true
    });

    const overdueTodos = await Todo.countDocuments({
      user: req.user._id,
      dueDate: { $lt: new Date() },
      completed: false
    });

    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    res.json({
      month,
      totalTodos,
      completedTodos,
      pendingTodos: totalTodos - completedTodos,
      overdueTodos,
      completionRate
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      error: { message: "Failed to fetch statistics", details: error.message }
    });
  }
});

// Create todo
router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    body("category")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Category cannot exceed 50 characters"),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const todoData = {
        title: req.body.title,
        dueDate: req.body.dueDate || null,
        priority: req.body.priority || "medium",
        category: req.body.category || null,
        user: req.user._id
      };

      const todo = new Todo(todoData);
      await todo.save();
      res.status(201).json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({
        error: { message: "Failed to create todo", details: error.message }
      });
    }
  }
);

// Toggle completed
router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid todo ID"),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });

      if (!todo) {
        return res.status(404).json({
          error: { message: "Todo not found" }
        });
      }

      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date() : null;
      await todo.save();
      res.json(todo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({
        error: { message: "Failed to update todo", details: error.message }
      });
    }
  }
);

// Update todo (for editing title, due date, priority, etc.)
router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid todo ID"),
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
    body("category")
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage("Category cannot exceed 50 characters"),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const updates = {};
      if (req.body.title !== undefined) updates.title = req.body.title;
      if (req.body.dueDate !== undefined) updates.dueDate = req.body.dueDate;
      if (req.body.priority !== undefined) updates.priority = req.body.priority;
      if (req.body.category !== undefined) updates.category = req.body.category;

      const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        updates,
        { new: true, runValidators: true }
      );

      if (!todo) {
        return res.status(404).json({
          error: { message: "Todo not found" }
        });
      }

      res.json(todo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({
        error: { message: "Failed to update todo", details: error.message }
      });
    }
  }
);

// Delete todo
router.delete(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid todo ID"),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });

      if (!todo) {
        return res.status(404).json({
          error: { message: "Todo not found" }
        });
      }

      res.json({ message: "Todo deleted successfully", todo });
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({
        error: { message: "Failed to delete todo", details: error.message }
      });
    }
  }
);

module.exports = router;
