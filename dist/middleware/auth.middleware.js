"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Attach user to the request
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
exports.errorMiddleware = errorMiddleware;
