import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

// Define the context type for dynamic routes
interface RouteContext {
  params: { id: string };
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "id not found" }, { status: 404 });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return NextResponse.json({ error: "category not found" }, { status: 404 });
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json(
      { message: "category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
