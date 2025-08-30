"use server"
import { reviewSchema } from "@/app/lib/zodSchema"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
export async function GET(){
    
    const reviews = await prisma.review.findMany({
        include:{
            user:true
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    return NextResponse.json(reviews,{status:200,statusText:"reviews fetched successfully"})
}


export async function POST(req:NextRequest){

    const body = await req.json();
    console.log(body);
    

    try {

        const parsed = reviewSchema.safeParse(body);
        if(!parsed.success){
            return NextResponse.json({error:parsed.error.format},{status:401})
        }

        const {rating,comment} = parsed.data

        const review = await prisma.review.create({
            data:{
                rating,
                comment,
                user:{
                    connect:{id:body.userId}
                },
                product:{
                    connect:{id:body.productId}
                }
            },
            include:{
                product:true,
                user:true
            }
        })

        

        return NextResponse.json(review,{status:201,statusText:"review created"})
        
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({error},{status:500,statusText:"failed creating review"})
    }

}