"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { ProductsWithRelations } from "@/app/types/prisma"
import { getAverageRating } from "@/app/lib/getAverageRating"
import { useCartStore } from "@/app/hooks/useCart"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HeroSection({products}:{products:ProductsWithRelations[]}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const router = useRouter();

  const {addItem} = useCartStore();

  const handleAddCart = (product:ProductsWithRelations) => {
    const item = {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      quantity:1,
      stock: product?.stock,
      image: product?.images?.[0].url,
    };
    addItem(item);
    router.push("/cart");
  };


  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying,products.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }


  if(products.length === 0){
    return(
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
       <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore our curated collection of premium products across all categories
          </p>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { name: "Electronics", icon: "📱", color: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
            { name: "Fashion", icon: "👕", color: "bg-pink-50 hover:bg-pink-100 border-pink-200" },
            { name: "Home & Garden", icon: "🏠", color: "bg-green-50 hover:bg-green-100 border-green-200" },
            { name: "Sports", icon: "⚽", color: "bg-orange-50 hover:bg-orange-100 border-orange-200" },
          ].map((category) => (
            <Card
              key={category.name}
              className={`${category.color} border-2 hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
    </div>
    )
  }

  return (
    <section className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="relative mb-4">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {products.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300 md:pl-6">
                    <CardContent >
                      <div className="grid md:grid-cols-2 items-center gap-y-2">
                        <div className="space-y-2 md:order-1">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(getAverageRating(product.reviews))
                                        ? "text-yellow-600 fill-yellow-600"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {getAverageRating(product.reviews)} ({product.reviews.length} reviews)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-primary md:pl-4">${product.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" onClick={() => handleAddCart(product)}>
                              <ShoppingCart/>
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                              <Link href={`products/${product.id}`}>
                              View Details
                              </Link>
                            </Button>
                          </div>
                        </div>


                        <div className="relative md:order-2">
                          <Image
                            src={product.images?.[0].url ?? undefined}
                            alt={product.name}
                            className="w-full h-[400px] object-cover rounded-lg"
                            width={300}
                            height={300}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

 
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 text-foreground backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 text-foreground backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

