"use server"

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req:NextRequest, {params}:{params:{id:string}}){

    const {id:productId} =  params;

    try {
        
        if(!productId) return NextResponse.json({error:"id is not defined"},{status:404});

        const reviews = await prisma.review.findMany({
            where:{
                productId
            },
            include:{
                user:true
            },
            orderBy:{
              createdAt:"desc"  
            }
        })
        const grouped = await prisma.review.groupBy({
            by: ["rating"],
            where: { productId },
            _count: { rating: true },
          });
      
          // 3. Normalize (ensure 1–5 are always present)
          const ratingSummary = [5, 4, 3, 2, 1].reduce((acc, star) => {
            const found = grouped.find((g) => g.rating === star);
            acc[star] = found ? found._count.rating : 0;
            return acc;
          }, {} as Record<number, number>);

        return NextResponse.json({reviews,ratingSummary},{status:200,statusText:"review fetched successfully"})

    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"error fetching reviews"})
    }

}