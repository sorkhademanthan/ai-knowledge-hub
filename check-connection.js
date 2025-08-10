const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function quickCheck() {
  try {
    await prisma.$connect()
    console.log('✅ MongoDB Connected!')
    return true
  } catch (error) {
    console.error('❌ Connection Failed:', error.message)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

quickCheck()
