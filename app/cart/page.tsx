"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/layout/Navigation"
import { redirect, useRouter } from "next/navigation"
import { QuantitySelector } from "@/components/QuantitySelector"
import { useCartStore } from "../hooks/useCart"
import { useSession } from "@/lib/auth-client"


export default function CartPage() {

  const {data:session, isPending} = useSession()
 
const {items,removeItem,getItemCount,getShipping,getSubtotal,getTax,getTotal,} = useCartStore();

  const router = useRouter()


  if(!session?.user && !isPending ) {
    return redirect("/login")
  }

 
  return (
    <div className="min-h-screen bg-background">
        <Navigation />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-accent-foreground">{items.length} items with {getItemCount()} quantity in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
    
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="h-16 w-16 text-accent-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
                  <p className="text-foreground mb-6">Add some products to get started</p>
                  <Link href="/products">
                    <Button >Continue Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id}>
                  <CardContent >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded"
                        />
                        {item.stock === 0 && <Badge className="absolute -top-2 -right-2 bg-red-600">Out of Stock</Badge>}
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-lg font-bold text-foreground">${item.price.toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                        {item.stock === 0 && <p className="text-sm text-red-600">This item is currently out of stock</p>}
                      </div>

                      <div className="flex items-center space-x-3">
                        <QuantitySelector item={item} />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

           
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-accent-foreground">Subtotal</span>
                    <span className="font-medium">${getSubtotal().toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-foreground">Shipping</span>
                    <span className="font-medium">{getShipping() === 0 ? "Free" : `$${getShipping().toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-accent-foreground">Tax</span>
                    <span className="font-medium">${getTax().toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotal().toLocaleString("en-Us",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                 
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={getItemCount() === 0 || items.some((item) => item.stock === 0)}
                      onClick={() => router.push("/checkout")}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                 

                  <p className="text-xs text-shadow-accent-foreground text-center">Free shipping on orders over $500</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Secure Checkout</p>
                    <p className="text-sm text-accent-foreground">SSL encrypted & PCI compliant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
