"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const prisma_1 = require("../generated/prisma");
// Create Prisma client with environment-specific configuration
const prisma = global.__prisma || new prisma_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
// In development, store the client globally to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
    global.__prisma = prisma;
}
// Test database connection
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Graceful shutdown
const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log('🔌 Database disconnected');
    }
    catch (error) {
        console.error('Error disconnecting database:', error);
    }
};
exports.disconnectDB = disconnectDB;
exports.default = prisma;
