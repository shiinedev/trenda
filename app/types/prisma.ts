import { Prisma } from "@prisma/client";

export type ProductsWithRelations = Prisma.ProductGetPayload<{
    include:{
        reviews:true,
        images:true,
        category:true
    }
}>


export type ReviewWithRelations = Prisma.ReviewGetPayload<{
    include:{
        product:true,
        user:true
    }
}>