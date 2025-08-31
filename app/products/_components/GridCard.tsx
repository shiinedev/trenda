import { getAverageRating } from "@/app/lib/getAverageRating";
import { ProductsWithRelations } from "@/app/types/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const GridCard = ({ product }: { product: ProductsWithRelations }) => {
  return (
    <Link href={`/products/${product.id}`} key={product.id}>
      <Card
        className={`group p-0 hover:shadow-xl transition-all duration-300 overflow-hidden`}>
        <div className="relative aspect-square overflow-hidden h-60">
          <Image
            src={product?.images?.[0].url ?? undefined}
            alt={"product image"}
            fill
            className="w-full h-full  object-cover group-hover:scale-105 transition-transform duration-500"
          />
        {product.stock === 0 && <Badge variant={"destructive"} className="absolute top-2 left-2 text-xs">out stock</Badge>}  
        </div>
        <CardContent className="pb-4">
          <h3 className="font-semibold text-slate-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-slate-600 truncate">
            {product.description}
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(getAverageRating(product.reviews))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
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
      </Card>
    </Link>
  );
};

export default GridCard;
