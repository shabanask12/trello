import { create } from 'zustand';
import { BoardData, Task } from '@/types'; // Make sure this path matches your types file

interface BoardState {
  board: BoardData | null;
  isLoading: boolean;
  fetchBoard: () => Promise<void>;
  moveTask: (sourceColId: string, destColId: string, sourceIndex: number, destIndex: number, taskId: string) => void;
  addTask: (columnId: string, title: string) => Promise<void>;
  deleteTask: (columnId: string, taskId: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  isLoading: true,

  // 1. FETCH BOARD DATA
  fetchBoard: async () => {
    try {
      const response = await fetch('/api/board');
      if (!response.ok) throw new Error('Failed to fetch board');
      const dbBoard = await response.json();

      // Normalize the SQL data for our Drag-and-Drop frontend
      const tasks: Record<string, Task> = {};
      const columns: Record<string, any> = {};
      const columnOrder: string[] = [];

      dbBoard.columns.forEach((col: any) => {
        columnOrder.push(col.id);
        const taskIds: string[] = [];

        col.tasks.forEach((task: any) => {
          // The spread operator (...) ensures we grab id, title, priority, createdAt, etc.
          tasks[task.id] = { ...task };
          taskIds.push(task.id);
        });

        columns[col.id] = { id: col.id, title: col.title, taskIds };
      });

      set({
        board: { tasks, columns, columnOrder },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading board:", error);
      set({ isLoading: false });
    }
  },

  // 2. ADD A NEW TASK TO THE DATABASE
  addTask: async (columnId, title) => {
    const state = get();
    const column = state.board?.columns[columnId];
    if (!column || !state.board) return;
    
    // Put the new task at the bottom of the column
    const order = column.taskIds.length;

    try {
      // Send the task to Neon via our Next.js API
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, columnId, order }),
      });

      if (!response.ok) throw new Error('Failed to save task');
      
      const savedTask = await response.json();

      // Instantly update the UI so the user sees the new task
      set((state) => {
        if (!state.board) return state;

        const newTask = { ...savedTask };
        
        return {
          board: {
            ...state.board,
            tasks: {
              ...state.board.tasks,
              [newTask.id]: newTask,
            },
            columns: {
              ...state.board.columns,
              [columnId]: {
                ...state.board.columns[columnId],
                taskIds: [...state.board.columns[columnId].taskIds, newTask.id],
              },
            },
          },
        };
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  },

  // 3. MOVE A TASK (DRAG AND DROP LOGIC)
  moveTask: (sourceColId, destColId, sourceIndex, destIndex, taskId) => {
    set((state) => {
      if (!state.board) return state;

      const newBoard = { ...state.board };
      const sourceCol = newBoard.columns[sourceColId];
      const destCol = newBoard.columns[destColId];

      // Moving within the same column
      if (sourceColId === destColId) {
        const newTaskIds = Array.from(sourceCol.taskIds);
        newTaskIds.splice(sourceIndex, 1);
        newTaskIds.splice(destIndex, 0, taskId);

        newBoard.columns[sourceColId].taskIds = newTaskIds;
      } 
      // Moving to a different column
      else {
        const sourceTaskIds = Array.from(sourceCol.taskIds);
        sourceTaskIds.splice(sourceIndex, 1);
        newBoard.columns[sourceColId].taskIds = sourceTaskIds;

        const destTaskIds = Array.from(destCol.taskIds);
        destTaskIds.splice(destIndex, 0, taskId);
        newBoard.columns[destColId].taskIds = destTaskIds;
      }

      // NOTE: Right now this only updates the UI. To make drag-and-drop save permanently,
      // we will eventually need to add a fetch('/api/tasks/reorder', { method: 'PUT' }) here!
      
      return { board: newBoard };
    });
  },

  // 4. DELETE A TASK (UI ONLY FOR NOW)
  deleteTask: (columnId, taskId) => {
    set((state) => {
      if (!state.board) return state;

      const newBoard = { ...state.board };
      
      // Remove task from the column's task array
      const newTaskIds = newBoard.columns[columnId].taskIds.filter(id => id !== taskId);
      newBoard.columns[columnId].taskIds = newTaskIds;
      
      // Delete the actual task object
      delete newBoard.tasks[taskId];

      return { board: newBoard };
    });
  },
}));