"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_cofig_1 = __importDefault(require("../DB/db.cofig"));
// Generate JWT token
const generateToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// Hash password
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
};
// Compare password
const comparePassword = async (password, hashedPassword) => {
    return bcryptjs_1.default.compare(password, hashedPassword);
};
// @desc    Register new user
// @route   POST /auth/register
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }
        // Check for existing user
        const existingUser = await db_cofig_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
            return;
        }
        // Hash password
        const hashedPassword = await hashPassword(password);
        // Create user
        const user = await db_cofig_1.default.user.create({
            data: {
                email,
                name: name || null,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            }
        });
        // Generate token
        const token = generateToken(user.id, user.email);
        // Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
                token
            }
        });
    }
    catch (error) {
        console.error('Register error:', error);
        next(error);
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }
        // Find user with password
        const user = await db_cofig_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                createdAt: true,
            }
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
        // Check password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
        // Generate token
        const token = generateToken(user.id, user.email);
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: userWithoutPassword,
                token
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Get current user
// @route   GET /auth/me
const getMe = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
            return;
        }
        const user = await db_cofig_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
