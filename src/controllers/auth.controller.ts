import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../DB/db.cofig';

// Types for request bodies
interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// JWT payload type
export interface JwtPayload {
  id: string;
  email: string;
}

// Generate JWT token
const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
};

// Hash password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// @desc    Register new user
// @route   POST /auth/register
export const register: RequestHandler<{}, {}, RegisterRequest> = async (req, res, next) => {
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
    const existingUser = await prisma.user.findUnique({
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
    const user = await prisma.user.create({
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

  } catch (error) {
    console.error('Register error:', error);
    
    next(error);
  }
};

// @desc    Login user
// @route   POST /auth/login
export const login: RequestHandler<{}, {}, LoginRequest> = async (req, res, next) => {
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
    const user = await prisma.user.findUnique({
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

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /auth/me
export const getMe: RequestHandler = async (req: Request & { user?: JwtPayload }, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
      return;
    }

    const user = await prisma.user.findUnique({
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

  } catch (error) {
    next(error);
  }
};
