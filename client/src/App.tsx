import { useState, useEffect } from "react"
import { Routes, Route, Link } from "react-router-dom"
import { TodoList } from "./components/TodoList"
import { TodoForm } from "./components/TodoForm"
import { api } from "./lib/axios"
import type { Todo, CreateTodoInput, CreateTodoFormInput } from "shared"

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch todos dari API
  const fetchTodos = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await api.get("/todos")
      if (response.data.success) {
        setTodos(response.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching todos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Create todo
  const handleCreateTodo = async (data: CreateTodoFormInput): Promise<void> => {
    try {
      const response = await api.post("/todos", data)
      if (response.data.success) {
        await fetchTodos() // Refresh todos list
      }
    } catch (error) {
      console.error("Error creating todo:", error)
      throw error
    }
  }

  // Update todo
  const handleUpdateTodo = async (id: string, data: Partial<Todo>): Promise<void> => {
    try {
      const response = await api.put(`/todos/${id}`, data)
      if (response.data.success) {
        await fetchTodos() // Refresh todos list
      }
    } catch (error) {
      console.error("Error updating todo:", error)
      throw error
    }
  }

  // Delete todo
  const handleDeleteTodo = async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/todos/${id}`)
      if (response.data.success) {
        await fetchTodos() // Refresh todos list
      }
    } catch (error) {
      console.error("Error deleting todo:", error)
      throw error
    }
  }

  // Load todos saat component mount
  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="p-4">
      <nav className="flex gap-4 mb-4">
        <Link to="/">Home</Link>
        <Link to="/add">Add Todo</Link>
      </nav>

      <Routes>
        <Route 
          path="/" 
          element={
            <TodoList 
              todos={todos}
              isLoading={isLoading}
              onCreateTodo={handleCreateTodo}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          } 
        />
        <Route 
          path="/add" 
          element={
            <TodoForm 
              onSubmit={handleCreateTodo}
            />
          } 
        />
      </Routes>
    </div>
  )
}
