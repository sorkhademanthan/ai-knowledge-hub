const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...')
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set ✅' : 'Not set ❌')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Successfully connected to MongoDB!')
    
    // Test database operations
    const userCount = await prisma.user.count()
    console.log(`📊 Current user count: ${userCount}`)
    
    const workspaceCount = await prisma.workspace.count()
    console.log(`📊 Current workspace count: ${workspaceCount}`)
    
    const documentCount = await prisma.document.count()
    console.log(`📊 Current document count: ${documentCount}`)
    
    // Test creating a simple record (and delete it)
    console.log('🧪 Testing database write operations...')
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER'
      }
    })
    console.log('✅ Test user created successfully!')
    
    // Clean up test data
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('🧹 Test user deleted successfully!')
    
    console.log('🎉 All database tests passed!')
    
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    
    if (error.code) {
      console.error('Error code:', error.code)
    }
    
    // Common error solutions
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Solution: Check your username/password in DATABASE_URL')
    }
    if (error.message.includes('network')) {
      console.log('\n💡 Solution: Check your internet connection and MongoDB Atlas network access')
    }
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Solution: Check your cluster URL in DATABASE_URL')
    }
    
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Disconnected from database')
  }
}

testConnection()
