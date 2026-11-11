export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = {
  title: string;
  description: string | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null; 
};