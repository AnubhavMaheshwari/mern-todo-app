const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: {
                    message: "No token provided. Please login to access this resource.",
                    status: 401
                }
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                error: {
                    message: "User not found. Token is invalid.",
                    status: 401
                }
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                error: {
                    message: "Invalid token. Please login again.",
                    status: 401
                }
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: {
                    message: "Token expired. Please login again.",
                    status: 401
                }
            });
        }

        res.status(500).json({
            error: {
                message: "Authentication failed. Please try again.",
                status: 500
            }
        });
    }
};

module.exports = authMiddleware;
