import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, columnId, order } = body;

    const newTask = await prisma.task.create({
      data: {
        title,
        columnId,
        order,
        priority: 'medium',
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Failed to create task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}