import { PrismaClient } from '../generated/prisma'

// Global variable to prevent multiple instances in development
declare global {
  var __prisma: PrismaClient | undefined
}

// Create Prisma client with environment-specific configuration
const prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
})

// In development, store the client globally to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  global.__prisma = prisma
}

// Test database connection
export const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

// Graceful shutdown
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect()
    console.log('🔌 Database disconnected')
  } catch (error) {
    console.error('Error disconnecting database:', error)
  }
}

export default prisma