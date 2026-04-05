import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let board = await prisma.board.findFirst({
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: { tasks: { orderBy: { order: 'asc' } } },
        },
      },
    });

    // Auto-seed if empty
    if (!board) {
      board = await prisma.board.create({
        data: {
          title: "Main Project",
          columns: {
            create: [
              { title: "To Do", order: 0 },
              { title: "In Progress", order: 1 },
              { title: "Done", order: 2 }
            ]
          }
        },
        include: {
          columns: {
            orderBy: { order: 'asc' },
            include: { tasks: { orderBy: { order: 'asc' } } },
          },
        },
      });
    }

    return NextResponse.json(board);
  } catch (error) {
    // This console.error is crucial—it will print the exact DB error to your terminal
    console.error("Database fetch error:", error); 
    return new Response("Internal Server Error", { status: 500 });
  }
}