"use server"
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(_req:Request, { params }: { params: { id: string }}) {

    const {id} = params;
    
    try {
        if(!id) return NextResponse.json({error:"id not found"},{status:404,statusText:"id not found"}) ;

         await prisma.category.delete({
            where:{id}
        })

        return NextResponse.json({message:"delete category successfully"},{status:200})

    } catch (error) {
        return NextResponse.json({error:error},{status:401});
    }

}