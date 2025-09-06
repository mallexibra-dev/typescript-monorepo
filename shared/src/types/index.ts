import { z } from "zod";

export type ApiResponse<T = unknown> = {
  data: T | null;
  message: string;
  success: boolean;
};

export const TodoStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  BLOCKED: "BLOCKED",
} as const;

export const TodoPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type TodoStatusType = (typeof TodoStatus)[keyof typeof TodoStatus];
export type TodoPriorityType = (typeof TodoPriority)[keyof typeof TodoPriority];

export const todoStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "BLOCKED",
]);
export const todoPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Judul harus diisi")
    .max(200, "Judul terlalu panjang"),
  description: z.string().optional(),
  status: todoStatusSchema.default("TODO"),
  priority: todoPrioritySchema.default("MEDIUM"),
  startAt: z.string().datetime().optional(),
  dueAt: z.string().datetime().optional(),
});

// Schema khusus untuk form yang tidak menggunakan default
export const createTodoFormSchema = z.object({
  title: z
    .string()
    .min(1, "Judul harus diisi")
    .max(200, "Judul terlalu panjang"),
  description: z.string().optional(),
  status: todoStatusSchema,
  priority: todoPrioritySchema,
  startAt: z.string().datetime().optional(),
  dueAt: z.string().datetime().optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Judul harus diisi")
    .max(200, "Judul terlalu panjang")
    .optional(),
  description: z.string().optional(),
  status: todoStatusSchema.optional(),
  priority: todoPrioritySchema.optional(),
  startAt: z.union([z.coerce.date(), z.null()]).optional(),
  dueAt: z.union([z.coerce.date(), z.null()]).optional(),
  completedAt: z.union([z.coerce.date(), z.null()]).optional(),
});

export const todoQuerySchema = z.object({
  status: todoStatusSchema.optional(),
  priority: todoPrioritySchema.optional(),
  page: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().min(1).default(1)
  ),
  limit: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().min(1).max(100).default(10)
  ),
  search: z.string().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type CreateTodoFormInput = z.infer<typeof createTodoFormSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;

export type Todo = {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatusType;
  priority: TodoPriorityType;
  startAt: Date | null;
  dueAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
