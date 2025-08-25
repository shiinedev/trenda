"use client"

import { api } from "@/app/lib/apiClient"
import { product } from "@/app/types/products"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"



const ProductsLits = () => {

  const router = useRouter();

  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products"),
    retry: 1,
  })

  const deleteMutation = useMutation({
    mutationFn:async (id:string) =>{
      const res = await api.delete(`/products/${id}`);
      return res.data
    },
    onSuccess:() =>{
      queryClient.invalidateQueries({queryKey:["products"]});
      toast.success("product deleted successfully");
    },
    onError:(err) =>{
      console.log("error deleting product",err);
      toast.error("error deleting product")
    }
  })

  
  const handleDelete = (id:string) =>{

    deleteMutation.mutateAsync(id);
  }

  if (isLoading) return <p>loading.....</p>





  return (
    <main className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Management</CardTitle>
           <Button asChild>
            <Link href="/dashboard/products/new">
            Add New Product
            </Link>
           </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products?.data &&  products.data.map((product:product) => (
              <Link href={`/products/${product._id}`} key={product._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Image
                  src={product.images?.[0] ?? ""}
                  alt={product.productName }
                  width={100}
                  height={100}
                  className="rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{product.productName}</h3>
                  <p className="text-slate-600">${product.price}</p>
                  <div className="flex items-center space-x-2 mt-1">
                   {
                    product.featured &&
                    <Badge variant="default">
                      featured
                    </Badge>
                   } 
                    <span className="text-sm text-slate-500">Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button> */}
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/products/${product._id}`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" 
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default ProductsLits

