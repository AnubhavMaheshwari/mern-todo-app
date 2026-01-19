const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d" // Token expires in 30 days
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                error: {
                    message: "Please provide name, email, and password",
                    status: 400
                }
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: {
                    message: "Password must be at least 6 characters long",
                    status: 400
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                error: {
                    message: "User with this email already exists",
                    status: 400
                }
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            error: {
                message: error.message || "Failed to register user",
                status: 500
            }
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: {
                    message: "Please provide email and password",
                    status: 400
                }
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                error: {
                    message: "Invalid email or password",
                    status: 401
                }
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: {
                    message: "Invalid email or password",
                    status: 401
                }
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: {
                message: "Failed to login. Please try again.",
                status: 500
            }
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", authMiddleware, async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            error: {
                message: "Failed to get user information",
                status: 500
            }
        });
    }
});

module.exports = router;
