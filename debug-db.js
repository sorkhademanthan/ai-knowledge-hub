const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

console.log('🔍 Database debugging...');
console.log('Current directory:', process.cwd());
console.log('Database URL from env:', process.env.DATABASE_URL);

const dbPath = path.join(process.cwd(), 'dev.db');
console.log('Expected database path:', dbPath);
console.log('Database file exists:', fs.existsSync(dbPath));

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`;
    console.log('📋 Tables in database:', tables);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
