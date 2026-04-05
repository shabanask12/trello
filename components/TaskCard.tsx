import { Draggable } from "@hello-pangea/dnd";
import { Task } from "@/types";
import { useBoardStore } from "@/store/useBoardStore"; // Import the store

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string; // Add this prop
}

export default function TaskCard({ task, index, columnId }: TaskCardProps) {
  const { deleteTask } = useBoardStore();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // Added 'group' class for hover effects
          className={`group relative bg-white p-3 mt-3 rounded-md shadow-sm border ${
            snapshot.isDragging ? "border-blue-500 shadow-md" : "border-gray-200"
          }`}
        >
          <p className="text-sm font-medium text-gray-800 pr-6">{task.title}</p>
          
          <span
            className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-700"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {task.priority}
          </span>

          {/* Delete Button (Visible on hover) */}
          <button
            onClick={() => deleteTask(columnId, task.id)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
    </Draggable>
  );
}