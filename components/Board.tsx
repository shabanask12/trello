"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useBoardStore } from "@/store/useBoardStore";
import Column from "./Column";

export default function Board() {
  const { board, moveTask } = useBoardStore();
  
  // Fix for Next.js hydration errors with drag-and-drop libraries
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area, do nothing
    if (!destination) return;

    // If dropped in the exact same spot, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Call our Zustand action to update the data!
    moveTask(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
      draggableId
    );
  };
if (!isMounted) return null;

  // Add this safety check! 
  // If the board hasn't loaded yet, show a loading message or return null
  if (!board) {
    return <div className="p-4 text-gray-500 font-medium">Loading board data...</div>;
  }
  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 items-start overflow-x-auto pb-4">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          const tasks = column.taskIds.map((taskId) => board.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </div>
    </DragDropContext>
  );
}