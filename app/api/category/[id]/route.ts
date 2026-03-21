import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

<<<<<<< HEAD
export async function DELETE(_req:Request, { params }: { params: { id: string }}) {
=======
type Params = { params: Promise<{ id: string }> };
>>>>>>> 337f6a94d4e91d1fabbab60acb1a9f02a1fdc61a

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  if (!id)
    return NextResponse.json({ error: "id is not defined" }, { status: 404 });
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category)
      return NextResponse.json(
        { error: "category is not defined" },
        { status: 404 }
      );

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
