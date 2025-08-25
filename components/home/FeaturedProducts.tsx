'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { product } from '@/app/types/products';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/apiClient';
import Link from 'next/link';


const featuredProducts = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 1247,
    image: 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'AI Pick',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Fitness Tracker',
    price: 199,
    originalPrice: 249,
    rating: 4.6,
    reviews: 892,
    image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Trending',
    category: 'Wearables'
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    price: 29,
    originalPrice: 39,
    rating: 4.7,
    reviews: 543,
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Eco-Friendly',
    category: 'Fashion'
  },
  {
    id: 4,
    name: 'Mechanical Gaming Keyboard',
    price: 159,
    originalPrice: 199,
    rating: 4.9,
    reviews: 2103,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Best Seller',
    category: 'Gaming'
  },
];

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

  const products = data?.data ?? []

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg">
              Handpicked by our AI for you
            </p>
          </div>
          <Button>View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            products?.length > 0 &&
          
          products?.map((product:product) => (
            <Link key={product._id} href={`/products/${product._id}`}>
               <Card  className="group p-0 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative aspect-square overflow-hidden h-60">
                <Image
                  src={product?.images?.[0] || ""}
                  alt={"product image"}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
               {
                product.featured &&
                <Badge 
                className={`absolute top-3 left-3 ${
                  product.featured  && 'ai-gradient text-white' 
                }`}
              >
                {product.featured && <Sparkles className="h-3 w-3 mr-1" />}
                {product.featured && "featured"}
              </Badge>
               } 

                {/* Wishlist Button */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleWishlist(product._id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : ''
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {product.productName}
                  </h3>
                  
                  {/* Rating */}
                  {/* <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div> */}

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