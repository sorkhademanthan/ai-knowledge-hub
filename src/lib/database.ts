import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

// It is recommended to export the prisma client as a singleton to avoid
// creating multiple instances, especially in development with hot reloading.
let globalPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalPrisma.prisma || prisma;

if (process.env.NODE_ENV !== 'production') {
  globalPrisma.prisma = db;
}