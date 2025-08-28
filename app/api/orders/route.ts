import { orderSchema } from "@/app/lib/zodSchema";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      _count: true,
      items: true,
      payment: true,
      user: true,
    },
  });

  return NextResponse.json(orders, {
    status: 200,
    statusText: "orders fetched successfully",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body", body);

  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format }, { status: 400 });
  }

  const { address, email, name, phone, postalCode, status } = parsed.data;
  try {
    const order = await prisma.order.create({
      data: {
        fullname: name,
        address,
        email,
        phone,
        postalCode,
        status,
        userId: body.userId,
        items: {
          create: body.items.map(
            (
              item:{name: string,
                price: number,
                quantity: number,
                productId: string}
            ) => ({
              name:item.name,
              price:item.price,
              quantity:item.quantity,
              productId:item.productId,
            })
          ),
        },
      },
      include:{
        items:true
      }
    });

    return NextResponse.json(order, {
      status: 201,
      statusText: "created order",
    });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 400, statusText: "error creating order" }
    );
  }
}
