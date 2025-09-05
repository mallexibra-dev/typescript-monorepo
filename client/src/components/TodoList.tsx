import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus } from "lucide-react"
import { TodoItem } from "./TodoItem"
import { TodoForm } from "./TodoForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Todo, TodoStatusType, TodoPriorityType, CreateTodoInput } from "shared"

interface TodoListProps {
  todos: Todo[]
  isLoading?: boolean
  onCreateTodo: (data: CreateTodoInput) => Promise<void>
  onUpdateTodo: (id: string, data: Partial<Todo>) => Promise<void>
  onDeleteTodo: (id: string) => Promise<void>
}

export function TodoList({ 
  todos, 
  isLoading = false, 
  onCreateTodo, 
  onUpdateTodo, 
  onDeleteTodo 
}: TodoListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TodoStatusType | "ALL">("ALL")
  const [priorityFilter, setPriorityFilter] = useState<TodoPriorityType | "ALL">("ALL")
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Filter todos berdasarkan search dan filter
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "ALL" || todo.status === statusFilter
    const matchesPriority = priorityFilter === "ALL" || todo.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Group todos by status
  const todosByStatus = {
    TODO: filteredTodos.filter(todo => todo.status === "TODO"),
    IN_PROGRESS: filteredTodos.filter(todo => todo.status === "IN_PROGRESS"),
    DONE: filteredTodos.filter(todo => todo.status === "DONE"),
    BLOCKED: filteredTodos.filter(todo => todo.status === "BLOCKED")
  }

  const getStatusColor = (status: TodoStatusType) => {
    switch (status) {
      case "TODO": return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "DONE": return "bg-green-100 text-green-800 hover:bg-green-200"
      case "BLOCKED": return "bg-red-100 text-red-800 hover:bg-red-200"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const handleCreateTodo = async (data: CreateTodoInput) => {
    await onCreateTodo(data)
    setIsFormOpen(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Todo List</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Todo List</h2>
          <p className="text-gray-600">Kelola tugas dan aktivitas Anda</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Todo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Todo Baru</DialogTitle>
            </DialogHeader>
            <TodoForm onSubmit={handleCreateTodo} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari todo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TodoStatusType | "ALL")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="TODO">Todo</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TodoPriorityType | "ALL")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Prioritas</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Summary */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={getStatusColor("TODO")}>
              Todo ({todosByStatus.TODO.length})
            </Badge>
            <Badge variant="outline" className={getStatusColor("IN_PROGRESS")}>
              In Progress ({todosByStatus.IN_PROGRESS.length})
            </Badge>
            <Badge variant="outline" className={getStatusColor("DONE")}>
              Done ({todosByStatus.DONE.length})
            </Badge>
            <Badge variant="outline" className={getStatusColor("BLOCKED")}>
              Blocked ({todosByStatus.BLOCKED.length})
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Todo Lists by Status */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(todosByStatus).map(([status, statusTodos]) => (
          <Card key={status} className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <Badge className={getStatusColor(status as TodoStatusType)}>
                  {statusTodos.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusTodos.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Tidak ada todo</p>
                </div>
              ) : (
                statusTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={onUpdateTodo}
                    onDelete={onDeleteTodo}
                  />
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}