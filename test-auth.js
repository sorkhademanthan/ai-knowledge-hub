const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔄 Creating test user...');
    
    // Delete existing test user if exists
    await prisma.password.deleteMany({
      where: { user: { email: 'test@example.com' } }
    });
    await prisma.user.deleteMany({
      where: { email: 'test@example.com' }
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create user with password
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
      include: {
        password: true,
      },
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔐 Password: password123');
    console.log('🔍 User ID:', user.id);
    console.log('🔍 Password Hash:', user.password?.hash?.substring(0, 20) + '...');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
