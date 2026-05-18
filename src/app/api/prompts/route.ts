import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildPromptContent, isReadyToSave } from "@/lib/prompt";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prompts = await prisma.prompt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      topic: true,
      task: true,
      taskOther: true,
      level: true,
      format: true,
      extra: true,
      createdAt: true,
    },
  });

  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const state = {
      topic: String(body.topic ?? ""),
      task: String(body.task ?? ""),
      taskOther: String(body.taskOther ?? ""),
      level: String(body.level ?? ""),
      format: String(body.format ?? ""),
      extra: String(body.extra ?? ""),
    };

    if (!isReadyToSave(state)) {
      return NextResponse.json(
        { error: "Complete topic, task, level, and format first." },
        { status: 400 }
      );
    }

    const content = buildPromptContent(state);
    const prompt = await prisma.prompt.create({
      data: {
        content,
        topic: state.topic.trim(),
        task: state.task,
        taskOther: state.task === "other" ? state.taskOther.trim() || null : null,
        level: state.level,
        format: state.format,
        extra: state.extra.trim() || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(prompt);
  } catch {
    return NextResponse.json(
      { error: "Failed to save prompt." },
      { status: 500 }
    );
  }
}
