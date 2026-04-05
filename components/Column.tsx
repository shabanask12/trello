import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Column as ColumnType, Task } from "@/types";
import { useBoardStore } from "@/store/useBoardStore";
import TaskCard from "./TaskCard";

interface ColumnProps {
    column: ColumnType;
    tasks: Task[];
}

export default function Column({ column, tasks }: ColumnProps) {
    const { addTask } = useBoardStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            addTask(column.id, newTaskTitle);
            setNewTaskTitle("");
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-[#f4f5f7] p-3 w-[280px] rounded-lg flex flex-col shrink-0">
            <h2 className="font-semibold text-gray-700 pb-2">{column.title}</h2>

            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-grow min-h-[150px] transition-colors ${snapshot.isDraggingOver ? "bg-gray-200 rounded-md" : ""
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} columnId={column.id} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {/* Add Task UI */}
            {isAdding ? (
                <div className="mt-3">
                    <textarea
                        className="w-full p-2 border border-blue-500 rounded-md text-sm outline-none resize-none"
                        placeholder="Enter a title for this card..."
                        autoFocus
                        rows={2}
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddTask();
                            }
                        }}
                    />
                    <div className="flex gap-2 mt-2 items-center">
                        <button
                            onClick={handleAddTask}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
                        >
                            Add card
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 font-medium flex items-center gap-2 w-full p-2 rounded transition-colors text-left"
                >
                    <span>+ Add a card</span>
                </button>
            )}
        </div>
    );
}