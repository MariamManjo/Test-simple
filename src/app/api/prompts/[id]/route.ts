import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const prompt = await prisma.prompt.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!prompt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.prompt.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
