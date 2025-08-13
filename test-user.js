const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔄 Creating test user...');
    
    // Check if database is accessible
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);

    // Delete existing test user if exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: { password: true }
    });

    if (existingUser) {
      console.log('🗑️ Deleting existing test user...');
      if (existingUser.password) {
        await prisma.password.delete({
          where: { userId: existingUser.id }
        });
      }
      await prisma.user.delete({
        where: { id: existingUser.id }
      });
    }

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
    console.log('🆔 User ID:', user.id);
    console.log('🔑 Password hash preview:', user.password?.hash?.substring(0, 20) + '...');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
