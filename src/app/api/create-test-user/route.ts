import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [API] Creating test user...');

    // Delete existing test user
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: { password: true }
    });

    if (existingUser) {
      console.log('🗑️ [API] Deleting existing user...');
      if (existingUser.password) {
        await prisma.userPassword.delete({ where: { userId: existingUser.id } });
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

    console.log('✅ [API] Test user created successfully!');

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password
      }
    });

  } catch (error) {
    console.error('❌ [API] Error creating test user:', error);
    return NextResponse.json({
      success: false,
      error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
