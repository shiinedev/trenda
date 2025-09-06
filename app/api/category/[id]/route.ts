import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


type Params = { params: { id: string } };

export async function DELETE({params}:Params){

    const {id} =  params;

    if(!id) return NextResponse.json({error:"id is not defined"},{status:404})
        try {
            const category = await prisma.category.findUnique({
                where:{id}
            });

            if(!category) return NextResponse.json({error:"category is not defined"},{status:404});

            await prisma.category.delete({
                where:{id}
            });

            return NextResponse.json({message:"category deleted successfully"},{status:200})

        } catch (error) {
            return NextResponse.json({error: error},{status:500})
        }
}