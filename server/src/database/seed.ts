import { PrismaClient, TodoStatus, TodoPriority } from '../generated/prisma'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  console.log('🌱 Memulai seeding database...')

  // Clear existing todos
  await prisma.todo.deleteMany()
  console.log('🗑️  Menghapus data todo yang sudah ada')

  // Sample todos data
  const todosData = [
    {
      title: 'Setup project BHVR',
      description: 'Setup initial project structure dengan Hono, React, dan Prisma',
      status: TodoStatus.DONE,
      priority: TodoPriority.HIGH,
      startAt: new Date('2024-01-01T09:00:00Z'),
      dueAt: new Date('2024-01-05T17:00:00Z'),
      completedAt: new Date('2024-01-03T15:30:00Z')
    },
    {
      title: 'Implementasi authentication',
      description: 'Buat sistem login dan register dengan JWT',
      status: TodoStatus.IN_PROGRESS,
      priority: TodoPriority.HIGH,
      startAt: new Date('2024-01-10T09:00:00Z'),
      dueAt: new Date('2024-01-15T17:00:00Z')
    },
    {
      title: 'Buat UI components dengan shadcn',
      description: 'Setup shadcn UI dan buat komponen-komponen dasar',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
      dueAt: new Date('2024-01-20T17:00:00Z')
    },
    {
      title: 'Setup database schema',
      description: 'Buat Prisma schema untuk Todo model',
      status: TodoStatus.DONE,
      priority: TodoPriority.HIGH,
      startAt: new Date('2024-01-02T10:00:00Z'),
      dueAt: new Date('2024-01-04T17:00:00Z'),
      completedAt: new Date('2024-01-03T14:20:00Z')
    },
    {
      title: 'Implementasi CRUD API untuk Todo',
      description: 'Buat endpoint GET, POST, PUT, DELETE untuk Todo',
      status: TodoStatus.IN_PROGRESS,
      priority: TodoPriority.HIGH,
      startAt: new Date('2024-01-08T09:00:00Z'),
      dueAt: new Date('2024-01-12T17:00:00Z')
    },
    {
      title: 'Setup testing framework',
      description: 'Setup Jest/Vitest untuk unit testing dan integration testing',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
      dueAt: new Date('2024-01-25T17:00:00Z')
    },
    {
      title: 'Implementasi real-time updates',
      description: 'Gunakan WebSocket atau Server-Sent Events untuk real-time todo updates',
      status: TodoStatus.TODO,
      priority: TodoPriority.LOW,
      dueAt: new Date('2024-02-01T17:00:00Z')
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Setup GitHub Actions untuk automated testing dan deployment',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
      dueAt: new Date('2024-01-30T17:00:00Z')
    },
    {
      title: 'Optimasi performance',
      description: 'Implementasi caching dan optimasi query database',
      status: TodoStatus.TODO,
      priority: TodoPriority.LOW,
      dueAt: new Date('2024-02-10T17:00:00Z')
    },
    {
      title: 'Bug fix: Login tidak berfungsi',
      description: 'Ada masalah dengan validasi JWT token di middleware',
      status: TodoStatus.BLOCKED,
      priority: TodoPriority.URGENT,
      startAt: new Date('2024-01-12T14:00:00Z'),
      dueAt: new Date('2024-01-13T17:00:00Z')
    },
    {
      title: 'Dokumentasi API',
      description: 'Buat dokumentasi API menggunakan Swagger/OpenAPI',
      status: TodoStatus.TODO,
      priority: TodoPriority.LOW,
      dueAt: new Date('2024-02-15T17:00:00Z')
    },
    {
      title: 'Setup monitoring dan logging',
      description: 'Implementasi logging system dan monitoring dengan tools seperti Sentry',
      status: TodoStatus.TODO,
      priority: TodoPriority.MEDIUM,
      dueAt: new Date('2024-02-05T17:00:00Z')
    }
  ]

  console.log(`🎉 Seeding selesai! ${todosData.length} todos berhasil dibuat`)
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 