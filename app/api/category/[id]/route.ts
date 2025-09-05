import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
