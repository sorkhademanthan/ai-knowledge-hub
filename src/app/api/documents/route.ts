// src/app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This API route will handle fetching the user's documents.
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('🔍 [API] Documents API - Session:', session);
    
    if (!session || !session.user?.id) {
      console.log('❌ [API] Unauthorized - No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 [API] Fetching documents for user:', session.user.id);

    const documents = await prisma.document.findMany({
      where: { authorId: session.user.id },
      select: {
        id: true,
        title: true,
        status: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    console.log('✅ [API] Found documents:', documents.length);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('❌ [API] Error fetching documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
