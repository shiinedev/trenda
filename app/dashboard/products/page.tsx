"use client";

import { api } from "@/app/lib/apiClient";
import { ProductsWithRelations } from "@/app/types/prisma";
import { ProductListSkeleton } from "@/components/skeletons/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBrandProducthunt } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const ProductsLits = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products"),
    retry: 1,
  });

  const products: ProductsWithRelations[] = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("product deleted successfully");
    },
    onError: (err) => {
      console.log("error deleting product", err);
      toast.error("error deleting product");
    },
  });

  const handleDelete = (id: string) => {

    toast.error("is not allowed to delete product for demo!")
   // deleteMutation.mutateAsync(id);
  };

  return (
    <main className="container p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Product Manager
          </h1>
          <p className="text-muted-foreground mt-2">Manage your Products</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">Add New Product</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Products ({products?.length | 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <ProductListSkeleton />
            ) : products.length > 0 ? (
              products.map((product: ProductsWithRelations) => (
                <div
                  key={product.id}
                  className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 p-4 border rounded-lg">
                  <Image
                    src={product.images?.[0]?.url ?? undefined}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded"
                  />
                  <div className="flex-1 flex-wrap">
                    <h3 className="font-semibold text-fore-ground">
                      {product.name}
                    </h3>
                    <h3 className="md:hidden font-semibold text-muted-foreground">
                      {product.description}
                    </h3>
                    <p className="text-muted-foreground">${product.price}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {product.isFeatured && (
                        <Badge variant="default">featured</Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end md:items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/products/${product.id}`)
                      }>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpen(true)}
                      className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
                    <AlertDialogTrigger asChild></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle >
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This product will permanently deleted &quot;
                          {product.name}&quot; and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant={"destructive"}
                            onClick={() => handleDelete(product.id)}>
                            {deleteMutation.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconBrandProducthunt className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-fore-ground mb-2">
                  No Products Found
                </h3>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProductsLits;
