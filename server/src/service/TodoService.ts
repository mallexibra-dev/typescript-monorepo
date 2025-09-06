import { PrismaClient, TodoStatus, TodoPriority } from '../generated/prisma'
import type { CreateTodoInput, UpdateTodoInput, TodoQueryInput, Todo } from 'shared'
import { formatTimeForDisplay, isOverdue, calculateTimeDifference } from '../utils/timeHelper'
import { db } from '../database/config'

export type FormattedTodo = Omit<Todo, 'startAt' | 'dueAt' | 'completedAt' | 'createdAt' | 'updatedAt'> & {
  startAt: string | null
  dueAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  startAtFormatted: string
  dueAtFormatted: string
  completedAtFormatted: string
  createdAtFormatted: string
  updatedAtFormatted: string
  isOverdue: boolean
  timeUntilDue?: string
  timeSinceCreated: string
}

export class TodoService {
  private prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || db
  }

  private formatTodo(todo: Todo): FormattedTodo {
    const now = new Date()
    
    return {
      ...todo,
      startAt: todo.startAt?.toISOString() || null,
      dueAt: todo.dueAt?.toISOString() || null,
      completedAt: todo.completedAt?.toISOString() || null,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      
      startAtFormatted: formatTimeForDisplay(todo.startAt, { showTime: true, format: 'short' }),
      dueAtFormatted: formatTimeForDisplay(todo.dueAt, { showTime: true, format: 'short' }),
      completedAtFormatted: formatTimeForDisplay(todo.completedAt, { showTime: true, format: 'short' }),
      createdAtFormatted: formatTimeForDisplay(todo.createdAt, { showTime: true, format: 'short' }),
      updatedAtFormatted: formatTimeForDisplay(todo.updatedAt, { showTime: true, format: 'short' }),
      
      isOverdue: isOverdue(todo.dueAt),
      timeUntilDue: todo.dueAt ? this.calculateTimeUntilDue(todo.dueAt) : undefined,
      timeSinceCreated: formatTimeForDisplay(todo.createdAt, { showRelative: true })
    }
  }

  private calculateTimeUntilDue(dueDate: Date): string {
    const now = new Date()
    const diff = calculateTimeDifference(now, dueDate)
    
    if (diff.totalSeconds < 0) {
      return 'Sudah lewat'
    }
    
    if (diff.days > 0) {
      return `${diff.days} hari lagi`
    } else if (diff.hours > 0) {
      return `${diff.hours} jam lagi`
    } else if (diff.minutes > 0) {
      return `${diff.minutes} menit lagi`
    } else {
      return 'Segera'
    }
  }

  async getAllTodos(query: TodoQueryInput): Promise<{ todos: FormattedTodo[], total: number }> {
    const { status, priority, page, limit, search } = query
    const skip = (page - 1) * limit

    const where = {
      ...(status && { status: status as TodoStatus }),
      ...(priority && { priority: priority as TodoPriority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    const [todos, total] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { dueAt: 'asc' },
          { createdAt: 'desc' }
        ]
      }),
      this.prisma.todo.count({ where })
    ])

    const formattedTodos = todos.map(todo => this.formatTodo(todo))

    return { todos: formattedTodos, total }
  }

  async getTodoById(id: string): Promise<FormattedTodo | null> {
    const todo = await this.prisma.todo.findUnique({
      where: { id }
    })

    if (!todo) return null

    return this.formatTodo(todo)
  }

  async createTodo(data: CreateTodoInput): Promise<FormattedTodo> {
    const todoData = {
      ...data,
      startAt: data.startAt ? new Date(data.startAt) : null,
      dueAt: data.dueAt ? new Date(data.dueAt) : null
    }

    const todo = await this.prisma.todo.create({
      data: todoData
    })

    return this.formatTodo(todo)
  }

  async updateTodo(id: string, data: UpdateTodoInput): Promise<FormattedTodo | null> {
    const updateData = {
      ...data,
      startAt: data.startAt ? new Date(data.startAt) : undefined,
      dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
      completedAt: data.completedAt ? new Date(data.completedAt) : undefined
    }

    if (data.status === 'DONE' && !data.completedAt) {
      updateData.completedAt = new Date()
    }

    if (data.status && data.status !== 'DONE') {
      updateData.completedAt = undefined
    }

    const todo = await this.prisma.todo.update({
      where: { id },
      data: updateData
    })

    return this.formatTodo(todo)
  }

  async deleteTodo(id: string): Promise<boolean> {
    try {
      await this.prisma.todo.delete({
        where: { id }
      })
      return true
    } catch (error) {
      return false
    }
  }

  async getTodosByStatus(status: TodoStatus): Promise<FormattedTodo[]> {
    const todos = await this.prisma.todo.findMany({
      where: { status },
      orderBy: [
        { priority: 'desc' },
        { dueAt: 'asc' }
      ]
    })

    return todos.map(todo => this.formatTodo(todo))
  }

  async getOverdueTodos(): Promise<FormattedTodo[]> {
    const now = new Date()
    const todos = await this.prisma.todo.findMany({
      where: {
        dueAt: {
          lt: now
        },
        status: {
          not: 'DONE'
        }
      },
      orderBy: [
        { dueAt: 'asc' }
      ]
    })

    return todos.map(todo => this.formatTodo(todo))
  }

  async getTodoStats(): Promise<{
    total: number
    completed: number
    inProgress: number
    todo: number
    blocked: number
    overdue: number
    recentCreated: FormattedTodo[]
  }> {
    const [total, completed, inProgress, todo, blocked, overdue, recentCreated] = await Promise.all([
      this.prisma.todo.count(),
      this.prisma.todo.count({ where: { status: 'DONE' } }),
      this.prisma.todo.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.todo.count({ where: { status: 'TODO' } }),
      this.prisma.todo.count({ where: { status: 'BLOCKED' } }),
      this.prisma.todo.count({
        where: {
          dueAt: { lt: new Date() },
          status: { not: 'DONE' }
        }
      }),
      this.prisma.todo.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ])

    return {
      total,
      completed,
      inProgress,
      todo,
      blocked,
      overdue,
      recentCreated: recentCreated.map((todo) => this.formatTodo(todo)),
    };
  }
}