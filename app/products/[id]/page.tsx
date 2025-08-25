"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/app/lib/apiClient"
import { product } from "@/app/types/products"
import { Navigation } from "@/components/layout/Navigation"
import { useCartStore } from "@/app/stores/useCart"


export default function ProductDetailPage() {
    const params = useParams()
    const productId = params.id as string
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const { addItem } = useCartStore();

    const router = useRouter()

    const { data, isLoading } = useQuery({
        queryKey: ["product"],
        queryFn: async () => {
            const res = await api.get(`/products/${productId}`);
            return res.data;
        },
        retry: 1
    })

    const product: product = data;


    const handleAddCart = () => {
        const item = {
            id: product?._id,
            name: product?.name,
            price: product?.price,
            quantity,
            stock: product?.stock,
            image: product?.images?.[0]
        }
        addItem(item);
        router.push("/cart")
    }


    if (isLoading) return <h1>loading....</h1>

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
                    <p className="text-slate-600 mb-6">The product you are looking for does not exist.</p>
                    <Link href="/products">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }




    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
                        <Link href="/" className="hover:text-slate-900">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-slate-900">
                            Products
                        </Link>
                        <span>/</span>
                        <Link href={`/categories`} className="hover:text-slate-900">
                            {product.category}
                        </Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{product.name}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200">
                                <Image
                                    src={product.images?.[selectedImage] || "/placeholder.svg"}
                                    alt={product.name}
                                    width={600}
                                    height={600}
                                    className="w-full h-96 lg:h-[500px] object-cover transition-all duration-300"
                                    priority
                                />

                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
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
                                        className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${selectedImage === index
                                            ? "border-blue-600 ring-2 ring-blue-600/20"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <Image
                                            src={image || "/placeholder.svg"}
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
                                    <Badge variant="outline">{product.category}</Badge>
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
                                <p className="text-slate-600 mb-4">{product.description}</p>

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < Math.floor(4.5) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-slate-600 ml-2">4.5</span>
                                    </div>
                                    <span className="text-slate-500">(120 reviews)</span>
                                    <span className="text-slate-500">•</span>
                                    <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-slate-900">${product.price}</span>
                                {/* {product.originalPrice && (
                <span className="text-xl text-slate-500 line-through">${product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Save ${product.originalPrice - product.price}
                </Badge>
              )} */}
                            </div>


                            {/* Quantity and Actions */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-slate-700">Quantity:</span>
                                    <div className="flex items-center border border-slate-300 rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="h-10 w-10"
                                            disabled={product.stock === 0}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="h-10 w-10"
                                            disabled={product.stock == 0}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <Button size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleAddCart} disabled={product.stock == 0}>
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={isWishlisted ? "text-red-600 border-red-600" : ""}
                                    >
                                        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-600" : ""}`} />
                                    </Button>
                                    <Button size="lg" variant="outline">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="space-y-3 p-4 bg-slate-100 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Truck className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {product ? "Free Shipping" : "Shipping Available"}
                                        </p>
                                        <p className="text-sm text-slate-600">2</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <RotateCcw className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-slate-900">30-Day Returns</p>
                                        <p className="text-sm text-slate-600">Free returns on all orders</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Shield className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <p className="font-medium text-slate-900">Warranty</p>
                                        <p className="text-sm text-slate-600">2 years</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </main>
        </>
    )
}
