import { Hono } from 'hono'
import { TodoController } from '../controller/TodoController'
import { createTodoSchema, updateTodoSchema, todoQuerySchema } from 'shared'
import { zValidator } from '@hono/zod-validator'

const todoRoutes = new Hono()
const todoController = new TodoController()

todoRoutes.get(
  '/',
  zValidator('query', todoQuerySchema),
  (c) => todoController.getAllTodos(c)
)

todoRoutes.get('/overdue', (c) => todoController.getOverdueTodos(c))

todoRoutes.get('/:id', (c) => todoController.getTodoById(c))

todoRoutes.post(
  '/',
  zValidator('json', createTodoSchema),
  (c) => todoController.createTodo(c)
)

todoRoutes.put(
  '/:id',
  zValidator('json', updateTodoSchema),
  (c) => todoController.updateTodo(c)
)

todoRoutes.delete('/:id', (c) => todoController.deleteTodo(c))

export default todoRoutes 