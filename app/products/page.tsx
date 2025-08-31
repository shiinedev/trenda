import { Navigation } from "@/components/layout/Navigation";
import ProductsList from "./_components/ProductList";

import prisma from "@/lib/prisma";
import { ProductsWithRelations } from "../types/prisma";
import { Category } from "@prisma/client";

export default async function ProductsPage() {
 
  const products:ProductsWithRelations[] = await prisma.product.findMany({
    include:{
      category:true,
      images:true,
      reviews:true
    }
  })
  console.log("products",products);
  

  const categories:Category[] = await prisma.category.findMany({})

  
  return (
    <>
      <Navigation />
      <ProductsList products={products} categories={categories} />
    </>
  );
}
