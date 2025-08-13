// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // ===== USERS =====
  const adminPassword = await bcrypt.hash('adminpassword123', 10)
  const demoPassword = await bcrypt.hash('demopassword123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@knowledgehub.com' },
    update: {
      name: 'Admin User',
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    create: {
      email: 'admin@knowledgehub.com',
      name: 'Admin User',
      role: 'ADMIN',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      password: {
        create: {
          hash: adminPassword,
        },
      },
    },
  })

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@knowledgehub.com' },
    update: {
      name: 'Demo User',
      role: 'USER',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612d5e5?w=150',
    },
    create: {
      email: 'demo@knowledgehub.com',
      name: 'Demo User',
      role: 'USER',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612d5e5?w=150',
      password: {
        create: {
          hash: demoPassword,
        },
      },
    },
  })

  // ===== WORKSPACE =====
  const demoWorkspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {
      name: 'Demo Workspace',
      description: 'A workspace for testing and demonstration',
    },
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'A workspace for testing and demonstration',
      owner: { connect: { id: adminUser.id } },
      members: {
        create: [
          {
            userId: adminUser.id,
            role: 'OWNER',
          },
          {
            userId: demoUser.id,
            role: 'EDITOR',
          },
        ],
      },
    },
  })

  // ===== DOCUMENTS =====
  const welcomeDoc = await prisma.document.upsert({
    where: {
      title_workspaceId: {
        title: 'Welcome to Knowledge Hub',
        workspaceId: demoWorkspace.id,
      },
    },
    update: {
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
    },
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
      author: { connect: { id: adminUser.id } },
      workspace: { connect: { id: demoWorkspace.id } },
    },
  })

  const brainstormDoc = await prisma.document.upsert({
    where: {
      title_workspaceId: {
        title: 'AI Brainstorming Session',
        workspaceId: demoWorkspace.id,
      },
    },
    update: {
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
    },
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
      author: { connect: { id: demoUser.id } },
      workspace: { connect: { id: demoWorkspace.id } },
    },
  })

  // ===== SUBSCRIPTIONS =====
  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {
      planType: 'TEAM',
      documentsLimit: null,
      aiRequestsLimit: null,
      storageLimit: null,
      teamMembersLimit: null,
    },
    create: {
      userId: adminUser.id,
      planType: 'TEAM',
      documentsLimit: null,
      aiRequestsLimit: null,
      storageLimit: null,
      teamMembersLimit: null,
    },
  })

  await prisma.subscription.upsert({
    where: { userId: demoUser.id },
    update: {
      planType: 'FREE',
      documentsLimit: 3,
      aiRequestsLimit: 50,
      storageLimit: BigInt(100 * 1024 * 1024),
      teamMembersLimit: 2,
    },
    create: {
      userId: demoUser.id,
      planType: 'FREE',
      documentsLimit: 3,
      aiRequestsLimit: 50,
      storageLimit: BigInt(100 * 1024 * 1024),
      teamMembersLimit: 2,
    },
  })

  // ===== COMMENTS =====
  await prisma.comment.create({
    data: {
      content: 'Great introduction! Love the AI features.',
      documentId: welcomeDoc.id,
      authorId: demoUser.id,
    },
  })

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