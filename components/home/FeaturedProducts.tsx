'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/apiClient';
import Link from 'next/link';
import { ProductsWithRelations } from '@/app/types/prisma';
import { getAverageRating } from '@/app/lib/getAverageRating';


export default  function FeaturedProducts() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products"),
    retry: 1,
  })
  
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (isLoading) return <p>loading.....</p>

 const products:ProductsWithRelations[] = data?.data ?? []
  console.log(products);

  
  

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trended Products
            </h2>
            <p className="text-muted-foreground text-lg">
              our trended products
            </p>
          </div>
          <Button asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
           
           products?.length > 0 &&
          
          products?.map((product:ProductsWithRelations) => (
            <Link key={product.id} href={`/products/${product.id}`}>
               <Card  className="group p-0 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative aspect-square overflow-hidden h-60">
                <Image
                  src={product.images?.[0].url}
                  alt={"product image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
               {
                product.isFeatured &&
                <Badge 
                className={`absolute top-3 left-3 ${
                  product.isFeatured  && 'ai-gradient text-white' 
                }`}
              >
                {product.isFeatured && <Sparkles className="h-3 w-3 mr-1" />}
                {product.isFeatured && "featured"}
              </Badge>
               } 

                {/* Wishlist Button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                    }`} 
                  />
                </Button>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="w-full ai-gradient text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <Badge variant={"secondary"} className='text-xs text-muted-foreground uppercase tracking-wide'>{product.category.name}</Badge>
                  <p className="font-semibold text-sm leading-tight line-clamp-2  capitalize">
                    {product.name}
                  </p>
                  <h3 className="text-sm text-muted-foreground leading-tight line-clamp-2 truncate">
                    {product.description}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(getAverageRating(product.reviews))
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews.length})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">${product.price}</span>
                    {product.price > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
           
          ))}
        </div>
      </div>
    </section>
  );
}