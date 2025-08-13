const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔄 Creating test user...');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: { password: true }
    });

    if (existingUser) {
      console.log('🗑️ Deleting existing user...');
      if (existingUser.password) {
        await prisma.password.delete({ where: { userId: existingUser.id } });
      }
      await prisma.user.delete({ where: { id: existingUser.id } });
    }

    // Hash password
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

    console.log('✅ Test user created!');
    console.log('📧 Email: test@example.com');
    console.log('🔐 Password: password123');
    console.log('🆔 User ID:', user.id);

    // Verify the user can be found
    const verifyUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: { password: true }
    });

    console.log('🔍 Verification - User exists:', !!verifyUser);
    console.log('🔍 Verification - Has password:', !!verifyUser?.password);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
