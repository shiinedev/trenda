import { Prisma } from "@prisma/client";

export type ProductsWithRelations = Prisma.ProductGetPayload<{
    include:{
        reviews:true,
        images:true,
        category:true
    }
}>