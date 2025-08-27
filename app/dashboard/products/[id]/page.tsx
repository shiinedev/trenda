"use client"
import { api } from "@/app/lib/apiClient"
import { useQuery } from "@tanstack/react-query"
import ProductForm from "../_components/ProductForm"

 

const ProductEdit = ({params}:{params:{id:string}}) => {
    

    const {data,isLoading} = useQuery({
        queryKey:["product"],
        queryFn: async() =>{
            const res = await api.get(`/products/${params.id}`);
            return res.data;
        },
        retry:1
    })
    

    if(isLoading) return <p>loading...</p>

  return (
    <ProductForm product={data} />
  )
}

export default ProductEdit
