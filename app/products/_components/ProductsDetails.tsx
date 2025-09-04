"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductsWithRelations } from "@/app/types/prisma";
import { getAverageRating } from "@/app/lib/getAverageRating";
import { useCartStore } from "@/app/hooks/useCart";
import Reviews from "../_components/Reviews";


export default function ProductDetails({
  product,
}: {
  product: ProductsWithRelations;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
 

  const { addItem } = useCartStore();

  const router = useRouter();

  const handleAddCart = () => {
    const item = {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      quantity,
      stock: product?.stock,
      image: product?.images?.[0].url,
    };
    addItem(item);
    router.push("/cart");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product you are looking for does not exist.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <Link href={`/categories`} className="hover:text-foreground">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl bg-card border">
              <Image
                src={product.images?.[selectedImage].url ?? undefined}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 lg:h-[500px] object-cover transition-all duration-300"
                priority
              />

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-5 gap-2">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    selectedImage === index
                      ? "border-blue-600 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}>
                  <Image
                    src={image.url ?? undefined}
                    alt={`${product.name} view ${index + 1}`}
                    width={120}
                    height={120}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {/* <Badge variant="outline">{product.brand}</Badge> */}
                <Badge variant="outline">{product.category.name}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground mb-4">{product.description}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(getAverageRating(product.reviews))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                  <span className="text-muted-foreground ml-2">
                    {getAverageRating(product.reviews).toFixed(1)}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews.length} reviews)
                </span>
                <span className="text-muted-foreground">•</span>
                <span
                  className={`font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-purple-600">
                ${product.price.toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-foreground">
                  Quantity:
                </span>
                <div className="flex items-center border border-muted-foreground rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                    disabled={product.stock === 0}>
                    <Minus className="h-4 w-4 text-foreground" />
                  </Button>
                  <span className="px-4 py-2 text-center text-foreground min-w-[3rem]">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                    disabled={quantity > product.stock}>
                    <Plus className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddCart}
                  disabled={product.stock == 0 || quantity > product.stock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock >= 0 || quantity > product.stock
                    ? "Add to Cart"
                    : "Out of Stock"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlist(!isWishlist)}
                  className={isWishlist ? "text-red-600 border-red-600" : "text-foreground"}>
                  <Heart
                    className={`h-5 w-5 ${isWishlist ? "fill-red-600" : ""}`}
                  />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5 text-foreground" />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 p-4 bg-accent rounded-lg">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-foreground">
                    {product ? "Free Shipping" : "Shipping Available"}
                  </p>
                  <p className="text-sm text-muted-foreground">2</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-foreground">30-Day Returns</p>
                  <p className="text-sm text-muted-foreground">
                    Free returns on all orders
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-foreground">Warranty</p>
                  <p className="text-sm text-muted-foreground">2 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Reviews id={product.id} />
    </main>
  );
}
