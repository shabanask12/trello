// types/index.ts

export type UniqueId = string;

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: UniqueId;
  title: string;
  description?: string;
  priority: TaskPriority;
  createdAt: string; // ISO 8601 string for serialization
}

export interface Column {
  id: UniqueId;
  title: string;
  taskIds: UniqueId[]; // References to Task IDs to maintain order
}

export interface BoardData {
  tasks: Record<UniqueId, Task>;
  columns: Record<UniqueId, Column>;
  columnOrder: UniqueId[]; // Defines the visual order of the columns
}