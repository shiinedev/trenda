"use server"

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req:NextRequest,{params}:{params:{id:string}}) {

    const {id} = await params;
    const body = await req.json();
    console.log("patch body",body);
    

    try {
        if(!id) return NextResponse.json({error:"id not found"},{status:404,statusText:"id not found"});
        const order = await prisma.order.findUnique({
            where:{
                id
            },
            include:{
                _count:true,
                items:true,
                user:true
            }
        });

        if(!order) return NextResponse.json({error:"order not found"},{status:404,statusText:"order not found"});

       const updated =  await prisma.order.update({
            where:{id},
            data:{
                status:body.status
            },
            include:{
                _count:true,
                items:true,
                user:true
            }
        });
        return NextResponse.json({message:"order status updated successfully",updated},{status:200})
        
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({error},{status:500,statusText:"server error"});
    }

}