import { getAverageRating } from "@/app/lib/getAverageRating";
import { ProductsWithRelations } from "@/app/types/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";



const ListCard = ({product}:{product:ProductsWithRelations}) => {
  return (
    <Suspense fallback={<p>Loading.....</p>}>
    <Link href={`/products/${product.id}`} key={product.id}>
      <Card
        className={`group p-0 hover:shadow-xl transition-all duration-300 overflow-hidden mb-4`}>
        <div className="flex p-4">
            <div className="relative overflow-hidden rounded-lg flex-shrink-0">
              <Image
                src={product.images?.[0].url ?? undefined}
                alt={product.name}
                width={100}
                height={100}
                className="w-30 h-30 object-cover"
              />
            {product.stock === 0 && <Badge variant={"destructive"} className="absolute top-2 left-2 text-xs">out stock</Badge>}  
            </div>
            <CardContent className="flex-1 space-y-2">
              <h3 className="font-semibold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-600">{product.description}</p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-slate-600">
                    {getAverageRating(product.reviews).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  ({product.reviews.length} reviews)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-slate-900">
                  ${product.price.toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}
                  </span>
                </div>
                <Button size="sm">Add to Cart</Button>
              </div>
            </CardContent>
          </div>
      </Card>
    </Link>
    </Suspense>
  );
};

export default ListCard;
