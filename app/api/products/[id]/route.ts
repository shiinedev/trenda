"use server";

import { updateProductSchema } from "@/app/lib/zodSchema";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteProductWithRelations } from "@/app/lib/delete";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id not found" }, { status: 404 });

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        reviews: true,
      },
    });

    if (!product)
      return NextResponse.json({ error: "product not found" }, { status: 404 });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "id not found" }, { status: 404 });

  try {
    const data = await req.json();
    const validate = updateProductSchema.safeParse(data);

    if (!validate.success)
      return NextResponse.json(
        { error: validate.error.flatten },
        { status: 500 }
      );

    const { name, description, categoryId, images, isFeatured, price, stock } =
      validate.data;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product)
      return NextResponse.json({ error: "product not found" }, { status: 404 });

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
        isFeatured,
        price,
        stock,
        images: {
          deleteMany: {},
          create: images?.map((url) => ({ url })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: "id not found" }, { status: 404 });

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product)
      return NextResponse.json({ error: "product not found" }, { status: 404 });

    await deleteProductWithRelations(id);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
