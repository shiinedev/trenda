
import { categorySchema } from "@/app/lib/zodSchema";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(){

    const categories = await prisma.category.findMany({
        include:{
            products:true
        }
    });

    return NextResponse.json(categories,{status:200})
}


export async function POST(req:Request){

    const body = req.json();

    const parsed = categorySchema.safeParse(body)
    if(!parsed.success) return NextResponse.json({error:"category name is required"},{status:400});
    

    const existing = await prisma.category.findUnique({
        where:{name:parsed.data.name}
    }) 

    if(existing) return NextResponse.json({error:"category al ready exists"},{status:400});

    const category = await prisma.category.create({
        data:{
            name:parsed.data.name
        }
    });

    return NextResponse.json(category,{status:201})

}