"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Grid, List, Star, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Latest gadgets, smartphones, laptops, and tech accessories",
      productCount: 1250,
      image: "/placeholder.svg?height=300&width=300",
      trending: true,
      subcategories: ["Smartphones", "Laptops", "Headphones", "Smart Home", "Gaming"],
      averageRating: 4.6,
      priceRange: "$10 - $2,999",
    },
    {
      id: 2,
      name: "Fashion & Apparel",
      description: "Trendy clothing, shoes, and accessories for all occasions",
      productCount: 890,
      image: "/placeholder.svg?height=300&width=300",
      trending: false,
      subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Jewelry"],
      averageRating: 4.4,
      priceRange: "$15 - $500",
    },
    {
      id: 3,
      name: "Home & Garden",
      description: "Everything for your home, from furniture to gardening tools",
      productCount: 650,
      image: "/placeholder.svg?height=300&width=300",
      trending: true,
      subcategories: ["Furniture", "Kitchen", "Garden", "Decor", "Storage"],
      averageRating: 4.5,
      priceRange: "$5 - $1,200",
    },
    {
      id: 4,
      name: "Sports & Fitness",
      description: "Athletic gear, fitness equipment, and outdoor recreation",
      productCount: 420,
      image: "/placeholder.svg?height=300&width=300",
      trending: false,
      subcategories: ["Fitness Equipment", "Athletic Wear", "Outdoor Gear", "Team Sports", "Water Sports"],
      averageRating: 4.7,
      priceRange: "$8 - $800",
    },
    {
      id: 5,
      name: "Books & Media",
      description: "Books, e-books, audiobooks, and educational materials",
      productCount: 1100,
      image: "/placeholder.svg?height=300&width=300",
      trending: false,
      subcategories: ["Fiction", "Non-Fiction", "Educational", "Children's Books", "E-books"],
      averageRating: 4.8,
      priceRange: "$3 - $150",
    },
    {
      id: 6,
      name: "Beauty & Personal Care",
      description: "Skincare, makeup, fragrances, and personal wellness products",
      productCount: 380,
      image: "/placeholder.svg?height=300&width=300",
      trending: true,
      subcategories: ["Skincare", "Makeup", "Hair Care", "Fragrances", "Personal Care"],
      averageRating: 4.3,
      priceRange: "$5 - $300",
    },
    {
      id: 7,
      name: "Automotive",
      description: "Car accessories, parts, tools, and maintenance products",
      productCount: 290,
      image: "/placeholder.svg?height=300&width=300",
      trending: false,
      subcategories: ["Car Parts", "Accessories", "Tools", "Maintenance", "Electronics"],
      averageRating: 4.4,
      priceRange: "$10 - $1,500",
    },
    {
      id: 8,
      name: "Toys & Games",
      description: "Fun toys, board games, puzzles, and educational games for all ages",
      productCount: 520,
      image: "/placeholder.svg?height=300&width=300",
      trending: true,
      subcategories: ["Action Figures", "Board Games", "Educational Toys", "Puzzles", "Video Games"],
      averageRating: 4.6,
      priceRange: "$5 - $200",
    },
  ]

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const aiRecommendedCategories = categories.filter((cat) => cat.trending).slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Shop by Category</h1>
          <p className="text-slate-600">Discover products across all our categories with AI-powered insights</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-300"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">{filteredCategories.length} categories</span>
              <div className="flex items-center space-x-1 border border-slate-300 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {aiRecommendedCategories.length > 0 && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  AI Trending Categories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiRecommendedCategories.map((category) => (
                    <Link key={category.id} href={`/products?category=${category.name.toLowerCase()}`}>
                      <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={50}
                          height={50}
                          className="rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-slate-900">{category.name}</h4>
                          <p className="text-sm text-slate-600">{category.productCount} products</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Categories Grid/List */}
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredCategories.map((category) => (
            <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className={viewMode === "grid" ? "p-0" : "p-4"}>
                {viewMode === "grid" ? (
                  <>
                    <div className="relative overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {category.trending && (
                        <Badge className="absolute top-3 left-3 bg-blue-600">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{category.name}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2">{category.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Products</span>
                          <span className="font-medium">{category.productCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Price Range</span>
                          <span className="font-medium">{category.priceRange}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Rating</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{category.averageRating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-700">Popular Subcategories:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <Badge key={sub} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                          {category.subcategories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.subcategories.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Link href={`/products?category=${category.name.toLowerCase()}`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Browse {category.name}</Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex space-x-4">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                      {category.trending && (
                        <Badge className="absolute -top-2 -right-2 bg-blue-600 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                        <p className="text-slate-600">{category.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Products: </span>
                          <span className="font-medium">{category.productCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Price Range: </span>
                          <span className="font-medium">{category.priceRange}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-500">Rating: </span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{category.averageRating}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">Subcategories:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.map((sub) => (
                            <Badge key={sub} variant="secondary" className="text-xs">
                              {sub}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Link href={`/products?category=${category.name.toLowerCase()}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700">Browse {category.name}</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No categories found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your search terms</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
