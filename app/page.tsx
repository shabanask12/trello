"use client";

import { useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useBoardStore } from "@/store/useBoardStore";
import Column from "@/components/Column";

export default function Home() {
  // Bring in our state and functions from the Zustand store
  const { board, isLoading, fetchBoard, moveTask } = useBoardStore();

  // Load the data from Neon database when the page opens
  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // THIS IS THE MISSING LOGIC: What happens when you drop a card
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 1. If the user dropped the card outside of a column, do nothing
    if (!destination) {
      return;
    }

    // 2. If the user dropped the card in the exact same spot it started, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 3. Send the exact coordinates to our Zustand store to update the UI
    moveTask(
      source.droppableId,      // Where it came from (Column ID)
      destination.droppableId, // Where it landed (Column ID)
      source.index,            // Its original position number
      destination.index,       // Its new position number
      draggableId              // The ID of the Task being moved
    );
  };

  // Show a loading screen while the database wakes up
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white font-bold text-2xl">
        Loading your board...
      </div>
    );
  }

  // If there's no data (database is completely empty)
  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white font-bold text-xl">
        No board found. Did the auto-seed fail?
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-blue-500 p-8 text-white font-sans overflow-x-auto">
      <h1 className="text-3xl font-bold mb-8">Real-Time Task Board</h1>
      
      {/* The Context wrapper listens for drag events and triggers onDragEnd */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 items-start">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            
            // Safety check: ensure tasks array exists before mapping
            const tasks = column.taskIds.map((taskId: string) => board.tasks[taskId]).filter(Boolean);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </div>
      </DragDropContext>
    </main>
  );
}