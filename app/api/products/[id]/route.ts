"use server";

import { updateProductSchema } from "@/app/lib/zodSchema";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id)
    return NextResponse.json({ error: "id not found" }, { status: 404 });

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  if (!params.id)
    return NextResponse.json({ error: "id not found" }, { status: 404 });

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
      where: { id: params.id },
    });

    if (!product)
      return NextResponse.json({ error: "product not found" }, { status: 404 });

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) return NextResponse.json({ error: "id not found" }, { status: 404 });

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product)
      return NextResponse.json({ error: "product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    return NextResponse.json(
      { message: "product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
