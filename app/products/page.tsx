"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Filter, Grid, List } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/apiClient";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { ProductsWithRelations } from "../types/prisma";
import { Category } from "@prisma/client";
import { getAverageRating } from "../lib/getAverageRating";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get("/products"),
    retry: 1,
  });
  const { data: category } = useQuery({
    queryKey: ["category"],
    queryFn: () => api.get("/category"),
    retry: 1,
  });

  const products: ProductsWithRelations[] = data?.data ?? [];

  const categories: Category[] = category?.data ?? [];
  console.log("categories", categories);

  const filteredProducts = products.filter((product) => {
    const inPriceRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const inCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category.id);
    return inPriceRange && inCategory;
  });
  console.log(selectedCategories);

  if (isLoading) return <h1>loading...</h1>;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              All Products
            </h1>
            <p className="text-slate-600">
              Discover amazing products with AI-powered recommendations
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </h3>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                    </div>

                    {/* Categories */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Categories
                      </label>
                      <div className="space-y-2">
                        {categories?.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2">
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories([
                                    ...selectedCategories,
                                    category.id,
                                  ]);
                                } else {
                                  setSelectedCategories(
                                    selectedCategories.filter(
                                      (c) => c !== category.id
                                    )
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={category.id}
                              className="text-sm text-slate-600">
                              {category.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600">
                    {filteredProducts.length} products found
                  </span>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}>
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}>
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Products */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : " space-y-4"
                }>
                {filteredProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id}>
                    <Card
                      className={`group p-0 hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        viewMode === "list" && "mb-4"
                      }`}>
                      {viewMode === "grid" ? (
                        <>
                          <div className="relative aspect-square overflow-hidden h-60">
                            <Image
                              src={product?.images?.[0].url || ""}
                              alt={"product image"}
                              fill
                              className="w-full h-full  object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* <Badge className="absolute top-3 left-3 bg-blue-600">{product.badge}</Badge> */}
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
                                      i <
                                      Math.floor(
                                        getAverageRating(product.reviews)
                                      )
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
                                  ${product.price}
                                </span>
                                
                              </div>
                              <Button size="sm">Add to Cart</Button>
                            </div>
                          </CardContent>
                        </>
                      ) : (
                        <div className="flex p-4">
                          <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                            <Image
                              src={
                                product.images?.[0].url || "/placeholder.svg"
                              }
                              alt={product.name}
                              width={100}
                              height={100}
                              className="w-30 h-30 object-cover"
                            />
                            {/* <Badge className="absolute top-2 left-2 text-xs bg-blue-600">{product.badge}</Badge> */}
                          </div>
                          <CardContent className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {product.description}
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-slate-600">
                                 {getAverageRating(product.reviews)}
                                </span>
                              </div>
                              <span className="text-sm text-slate-500">
                                ({product.reviews.length} reviews)
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-slate-900">
                                  ${product.price}
                                </span>
                                
                              </div>
                              <Button size="sm">Add to Cart</Button>
                            </div>
                          </CardContent>
                        </div>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
