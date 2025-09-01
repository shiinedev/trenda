'use client';

import { Suspense, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {Heart, ShoppingCart, Sparkles, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductsWithRelations } from '@/app/types/prisma';
import { getAverageRating } from '@/app/lib/getAverageRating';
import { ProductGridSkeleton } from '../skeletons/ProductSkeleton';


export default  function FeaturedProducts({products}:{products:ProductsWithRelations[]}) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

    

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold ">
              Featured <span className='text-purple-500 border-b-2 border-purple-500'>Products</span> 
            </h2>
            <p className="text-muted-foreground text-lg mt-2">
              Our Featured products
            </p>
          </div>
          <Button asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
           
           products.length > 0 &&
          
          products.slice(0,3).map((product:ProductsWithRelations) => (
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
                    <span className="font-bold text-lg">${product.price.toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
           
          ))}
        </div>
        </Suspense>
      </div>
    </section>
  );
}