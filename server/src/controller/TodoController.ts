import type { Context } from 'hono'
import { TodoService } from '../service/TodoService'
import { PrismaClient } from '../generated/prisma'
import type { ApiResponse, CreateTodoInput, UpdateTodoInput, TodoQueryInput } from 'shared'

export class TodoController {
  private todoService: TodoService

  constructor() {
    const prisma = new PrismaClient()
    this.todoService = new TodoService(prisma)
  }

  async getAllTodos(c: Context): Promise<Response> {
    try {
      const query = c.req.query()
      const validatedQuery = {
        status: query.status,
        priority: query.priority,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        search: query.search
      }

      const { todos, total } = await this.todoService.getAllTodos(validatedQuery as TodoQueryInput)

      const response: ApiResponse<{ todos: typeof todos, total: number, page: number, limit: number }> = {
        data: {
          todos,
          total,
          page: validatedQuery.page,
          limit: validatedQuery.limit
        },
        message: "Daftar todo berhasil diambil",
        success: true
      }

      return c.json(response, 200)
    } catch (error) {
      console.error(error)
      const response: ApiResponse = {
        data: null,
        message: "Gagal mengambil daftar todo",
        success: false
      }
      return c.json(response, 500)
    }
  }

  async getTodoById(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      
      if (!id) {
        const response: ApiResponse = {
          data: null,
          message: "ID todo diperlukan",
          success: false
        }
        return c.json(response, 400)
      }

      const todo = await this.todoService.getTodoById(id)

      if (!todo) {
        const response: ApiResponse = {
          data: null,
          message: "Todo tidak ditemukan",
          success: false
        }
        return c.json(response, 404)
      }

      const response: ApiResponse<typeof todo> = {
        data: todo,
        message: "Todo berhasil ditemukan",
        success: true
      }

      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        data: null,
        message: "Gagal mengambil todo",
        success: false
      }
      return c.json(response, 500)
    }
  }

  async createTodo(c: Context): Promise<Response> {
    try {
      const body = await c.req.json()
      const todoData = body as CreateTodoInput

      const todo = await this.todoService.createTodo(todoData)

      const response: ApiResponse<typeof todo> = {
        data: todo,
        message: "Todo berhasil dibuat",
        success: true
      }

      return c.json(response, 201)
    } catch (error) {
      const response: ApiResponse = {
        data: null,
        message: "Gagal membuat todo",
        success: false
      }
      return c.json(response, 500)
    }
  }

  async updateTodo(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const updateData = body as UpdateTodoInput

      if (!id) {
        const response: ApiResponse = {
          data: null,
          message: "ID todo diperlukan",
          success: false
        }
        return c.json(response, 400)
      }

      const todo = await this.todoService.updateTodo(id, updateData)

      if (!todo) {
        const response: ApiResponse = {
          data: null,
          message: "Todo tidak ditemukan",
          success: false
        }
        return c.json(response, 404)
      }

      const response: ApiResponse<typeof todo> = {
        data: todo,
        message: "Todo berhasil diupdate",
        success: true
      }

      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        data: null,
        message: "Gagal mengupdate todo",
        success: false
      }
      return c.json(response, 500)
    }
  }

  async deleteTodo(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')

      if (!id) {
        const response: ApiResponse = {
          data: null,
          message: "ID todo diperlukan",
          success: false
        }
        return c.json(response, 400)
      }

      const deleted = await this.todoService.deleteTodo(id)

      if (!deleted) {
        const response: ApiResponse = {
          data: null,
          message: "Todo tidak ditemukan",
          success: false
        }
        return c.json(response, 404)
      }

      const response: ApiResponse = {
        data: null,
        message: "Todo berhasil dihapus",
        success: true
      }

      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        data: null,
        message: "Gagal menghapus todo",
        success: false
      }
      return c.json(response, 500)
    }
  }

  async getOverdueTodos(c: Context): Promise<Response> {
    try {
      const todos = await this.todoService.getOverdueTodos()

      const response: ApiResponse<typeof todos> = {
        data: todos,
        message: "Daftar todo yang terlambat berhasil diambil",
        success: true
      }

      return c.json(response, 200)
    } catch (error) {
      const response: ApiResponse = {
        data: null,
        message: "Gagal mengambil todo yang terlambat",
        success: false
      }
      return c.json(response, 500)
    }
  }
} 