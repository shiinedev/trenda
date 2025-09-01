"use client";
import { Suspense, useState } from "react";
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
import { Category } from "@prisma/client";
import { ProductsWithRelations } from "@/app/types/prisma";
import GridCard from "./GridCard";
import ListCard from "./ListCard";
import { Filter, Grid, List } from "lucide-react";
import { ProductGridSkeleton, ProductListSkeleton } from "@/components/skeletons/ProductSkeleton";
import { IconShoppingCartFilled } from "@tabler/icons-react";

type productsListProps ={
    products:ProductsWithRelations[],
    categories:Category[]
}

export default function ProductsList({products,categories}:productsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);



  const filteredProducts = products.filter((product) => {
    const inPriceRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const inCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category.id);
    return inPriceRange && inCategory;
  });

  const handleClearFilter = () =>{
    setPriceRange([0,2000]);
    setSelectedCategories([])

  }


  return (
    <>
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              All Products
            </h1>
            <p className="text-slate-600">
              Discover amazing products 
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
              <Suspense fallback={viewMode == "grid" ? <ProductGridSkeleton /> :<ProductListSkeleton />}>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : " space-y-4"
                }>
                {filteredProducts.map((product) => (
                 viewMode == "grid"?
                 <GridCard key={product.id} product={product} />
                 :
                 <ListCard key={product.id} product={product} />
                ))}
              </div>
              </Suspense>

              {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconShoppingCartFilled className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Products found in this {selectedCategories}</h3>
            <p className="text-slate-600 mb-4">Try adjusting your selected terms</p>
            <Button variant="outline" onClick={handleClearFilter}>
              Clear Filter
            </Button>
          </div>
        )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
