const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔄 Setting up test user...');

    // Delete existing test user
    await prisma.user.deleteMany({
      where: { email: 'test@example.com' }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('🔑 Hashed password:', hashedPassword.substring(0, 20) + '...');

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

    console.log('✅ Test user created!');
    console.log('📧 Email: test@example.com');
    console.log('🔐 Password: password123');
    console.log('🆔 User ID:', user.id);

    // Test password verification
    const testVerify = await bcrypt.compare('password123', user.password.hash);
    console.log('🧪 Password verification test:', testVerify ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
