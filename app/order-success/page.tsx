"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Download, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "../hooks/useCart.ts"


export default function OrderSuccessPage() {
  const [orderNumber] = useState(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
  const [estimatedDelivery] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 5)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

 const {items,getSubtotal,getTax,getTotal} = useCartStore()
  

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-slate-600">Thank you for your purchase. Your order is being processed.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Order Number</h3>
                    <p className="text-slate-600 font-mono">{orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Estimated Delivery</h3>
                    <p className="text-slate-600">{estimatedDelivery}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{item.name}</h4>
                        <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-slate-900">${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax</span>
                      <span>${getTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Order Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Order Confirmed</p>
                      <p className="text-sm text-slate-600">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Processing</p>
                      <p className="text-sm text-slate-600">Within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <Truck className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-500">Shipped</p>
                      <p className="text-sm text-slate-400">2-3 business days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-slate-900">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    Track Order
                  </Button>
                  <Link href="/products">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Continue Shopping
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
