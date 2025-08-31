import React from 'react'
import ProductForm from '../_components/ProductForm'
import prisma from '@/lib/prisma';


const CreateProduct = async ({params}:{params:{id:string}}) => {
    const {id} =  params;

    const product = await prisma.product.findUnique({
       where:{
        id
       },
       include:{
        category:true,
        images:true,
        reviews:true,
       }
    })

  return(
    <ProductForm product={product}  />
  )
}

export default CreateProduct
