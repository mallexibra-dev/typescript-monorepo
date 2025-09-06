import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock,
  CheckCircle2,
  Circle,
  XCircle
} from "lucide-react"
import { TodoForm } from "./TodoForm"
import type { Todo, TodoStatusType, TodoPriorityType, UpdateTodoInput, CreateTodoFormInput } from "shared"

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, data: Partial<Todo>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const getStatusIcon = (status: TodoStatusType) => {
    switch (status) {
      case "TODO": return <Circle className="h-4 w-4" />
      case "IN_PROGRESS": return <Clock className="h-4 w-4" />
      case "DONE": return <CheckCircle2 className="h-4 w-4" />
      case "BLOCKED": return <XCircle className="h-4 w-4" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: TodoStatusType) => {
    switch (status) {
      case "TODO": return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800"
      case "DONE": return "bg-green-100 text-green-800"
      case "BLOCKED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: TodoPriorityType) => {
    switch (priority) {
      case "LOW": return "bg-gray-100 text-gray-800"
      case "MEDIUM": return "bg-blue-100 text-blue-800"
      case "HIGH": return "bg-orange-100 text-orange-800"
      case "URGENT": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: TodoPriorityType) => {
    switch (priority) {
      case "LOW": return "🟢"
      case "MEDIUM": return "🟡"
      case "HIGH": return "🟠"
      case "URGENT": return "🔴"
      default: return "⚪"
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleStatusToggle = async () => {
    setIsUpdating(true)
    try {
      const newStatus = todo.status === "DONE" ? "TODO" : "DONE"
      const completedAt = newStatus === "DONE" ? new Date().toISOString() : null
      
      await onUpdate(todo.id, { 
        status: newStatus,
        completedAt: completedAt ? new Date(completedAt) : null
      })
    } catch (error) {
      console.error("Error updating todo status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEdit = async (data: UpdateTodoInput) => {
    setIsUpdating(true)
    try {
      const payload = {
        ...data,
        startAt: data.startAt ? new Date(data.startAt) : null,
        dueAt: data.dueAt ? new Date(data.dueAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
      }
      await onUpdate(todo.id, payload)
      setIsEditOpen(false)
      setIsEdit(false)
    } catch (error) {
      console.error("Error updating todo:", error)
    } finally {
      setIsUpdating(false)
      setIsEdit(false)
    }
  }

  const handleFormSubmit = async (data: CreateTodoFormInput) => {
    const updateData: UpdateTodoInput = {
      ...data,
      startAt: data.startAt ? new Date(data.startAt) : null,
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
    }
    await handleEdit(updateData)
  }

  const handleDelete = async () => {
    setIsUpdating(true)
    try {
      await onDelete(todo.id)
      setIsDeleteOpen(false)
    } catch (error) {
      console.error("Error deleting todo:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={todo.status === "DONE"}
              onCheckedChange={handleStatusToggle}
              disabled={isUpdating}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h3 className={`font-medium text-sm ${
                  todo.status === "DONE" ? "line-through text-gray-500" : "text-gray-900"
                }`}>
                  {todo.title}
                </h3>
              </div>
              
              {todo.dueAt && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(todo.dueAt)}</span>
                </div>
              )}
              
              {todo.description && (
                <p className={`text-xs text-gray-600 mb-2 ${
                  todo.status === "DONE" ? "line-through" : ""
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-[10px] ${getStatusColor(todo.status)} space-x-1 hover:${getStatusColor(todo.status).split(' ')[0]} border-transparent`}>
                  {getStatusIcon(todo.status)} {todo.status.replace('_', ' ')}
                </Badge>
                <Badge className={`text-[10px] ${getPriorityColor(todo.priority)} space-x-1 hover:${getPriorityColor(todo.priority).split(' ')[0]} border-transparent`}>
                  {getPriorityIcon(todo.priority)} {todo.priority}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-400">
                Dibuat: {formatDate(todo.createdAt)}
                {todo.completedAt && (
                  <span className="ml-2">
                    • Selesai: {formatDate(todo.completedAt)}
                  </span>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault()
                      setIsEdit(true)
                    }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Todo</DialogTitle>
                    </DialogHeader>
                    <TodoForm 
                      onSubmit={handleFormSubmit}
                      isEdit={isEdit}
                      initialData={{
                        title: todo.title,
                        description: todo.description || "",
                        status: todo.status,
                        priority: todo.priority,
                        startAt: todo.startAt ? new Date(todo.startAt).toISOString() : undefined,
                        dueAt: todo.dueAt ? new Date(todo.dueAt).toISOString() : undefined
                      }}
                      isLoading={isUpdating}
                    />
                  </DialogContent>
                </Dialog>
                
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    setIsDeleteOpen(true)
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus todo "{todo.title}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isUpdating}
              className="bg-red-600 hover:bg-red-700"
            >
              {isUpdating ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}