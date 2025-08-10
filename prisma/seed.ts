import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // ===== USERS =====
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@knowledgehub.com' },
    update: {},
    create: {
      email: 'admin@knowledgehub.com',
      name: 'Admin User',
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
  })

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@knowledgehub.com' },
    update: {},
    create: {
      email: 'demo@knowledgehub.com',
      name: 'Demo User',
      role: 'USER',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612d5e5?w=150',
    },
  })

  // ===== WORKSPACE =====
  const demoWorkspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'A workspace for testing and demonstration',
      ownerId: adminUser.id,
    },
  })

  // Add workspace members separately
  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: adminUser.id,
        workspaceId: demoWorkspace.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      workspaceId: demoWorkspace.id,
      role: 'OWNER',
    },
  })

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: demoUser.id,
        workspaceId: demoWorkspace.id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      workspaceId: demoWorkspace.id,
      role: 'EDITOR',
    },
  })

  // ===== DOCUMENTS =====
  const welcomeDoc = await prisma.document.upsert({
    where: {
      title_workspaceId: {
        title: 'Welcome to Knowledge Hub',
        workspaceId: demoWorkspace.id
      }
    },
    update: {},
    create: {
      title: 'Welcome to Knowledge Hub',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Welcome to Knowledge Hub' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This is your AI-powered real-time knowledge hub. Start creating and collaborating with intelligent assistance.',
              },
            ],
          },
        ],
      },
      type: 'TEXT',
      status: 'PUBLISHED',
      authorId: adminUser.id,
      workspaceId: demoWorkspace.id,
    },
  });

  const brainstormDoc = await prisma.document.upsert({
    where: {
      title_workspaceId: {
        title: 'AI Brainstorming Session',
        workspaceId: demoWorkspace.id
      }
    },
    update: {},
    create: {
      title: 'AI Brainstorming Session',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'AI Brainstorming Session' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Use this document to explore the AI Co-Creation Canvas feature.',
              },
            ],
          },
        ],
      },
      type: 'BRAINSTORM',
      status: 'DRAFT',
      authorId: demoUser.id,
      workspaceId: demoWorkspace.id,
    },
  });

  // ===== SUBSCRIPTIONS =====
  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      planType: 'TEAM',
      documentsLimit: null,
      aiRequestsLimit: null,
      storageLimit: null,
      teamMembersLimit: null,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      planType: 'FREE',
      documentsLimit: 3,
      aiRequestsLimit: 50,
      storageLimit: BigInt(100 * 1024 * 1024), // 100MB - use BigInt for storageLimit
      teamMembersLimit: 2,
    },
  });

  // ===== COMMENTS =====
  // Simple approach - try to find existing comment first
  const existingComment = await prisma.comment.findFirst({
    where: {
      documentId: welcomeDoc.id,
      authorId: demoUser.id,
      content: 'Great introduction! Love the AI features.',
    },
  });

  if (!existingComment) {
    await prisma.comment.create({
      data: {
        content: 'Great introduction! Love the AI features.',
        documentId: welcomeDoc.id,
        authorId: demoUser.id,
      },
    });
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin User: admin@knowledgehub.com`)
  console.log(`👤 Demo User: demo@knowledgehub.com`)
  console.log(`🏢 Demo Workspace: ${demoWorkspace.slug}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })