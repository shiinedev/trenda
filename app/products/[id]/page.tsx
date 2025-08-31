import { ProductsWithRelations } from "@/app/types/prisma";
import { Navigation } from "@/components/layout/Navigation";
import prisma from "@/lib/prisma";
import ProductDetail from "../_components/ProductsDetails";

export default async function ProductDetailPage({params}:{params:{id:string}}) {
    
    const {id} =  params;

    const product:ProductsWithRelations = await prisma.product.findFirstOrThrow({
        where:{id},
        include:{
            images:true,
            category:true,
            reviews:true
        }
    })

    return (
        <>
            <Navigation />
           <ProductDetail product={product} />
        </>
    )
}
