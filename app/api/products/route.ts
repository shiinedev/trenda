"use server"

import { productSchema } from "@/app/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {

    const products = await prisma.product.findMany({
      include:{
        reviews:true,
        category:true,
      },
    })

    return NextResponse.json(products,{status:200,statusText:"product fetched successfully"});
  } catch (error) {
    console.error("get products error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);

    const parsed = productSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({
        status: 400,
        error: parsed.error,
      });
    }

    const {name,description,isFeatured,categoryId,stock,price,images} = parsed.data;
   

    const product = await prisma.product.create({
      data:{
        description,
        name,
        price,
        stock,
        isFeatured,
        categoryId,
        images:{
          create:images?.map((url:string) => ({url})) || []
        },
        
      },
      include:{images:true}
    })


    return NextResponse.json(product,{
      status:201 ,statusText:"product created successfully"});
  } catch (error) {
  return  NextResponse.json({error:error},{status: 500,},);
  }
}
