"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Truck, Shield, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "../hooks/useCart"
import {useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OrderInput, orderSchema } from "../lib/zodSchema"
import { FormField, FormItem, FormLabel, FormMessage, Form, FormControl } from "@/components/ui/form"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { api } from "../lib/apiClient"
import { useSession } from "@/lib/auth-client"

export default function CheckoutPage() {

  const [shippingMethod, setShippingMethod] = useState("standard")

  const {data:session} = useSession()

  const {items,getSubtotal,getShipping,getTax,getTotal,clearCart} = useCartStore();

  const form = useForm<OrderInput>({
    resolver:zodResolver(orderSchema),
    defaultValues:{
      name:"",
      email:"",
      phone:"",
      address:"",
      postalCode:"",
      status:"PENDING"
    }
  })

  const createOrder = useMutation({
    mutationFn:async (data:OrderInput) =>{
      const res = await api.post("/orders",data);
      return res.data
    },
    onSuccess:()=>{
      toast.success("order completed successfully");
      clearCart();
      form.reset()
    },
    onError:(err) =>{
      console.log("order error",err);
      toast.error("order is not completed!")
    }
  })
 
  const onSubmit = async (data:OrderInput) =>{
   
    if(items.length === 0){
      toast.warning("No items to order please Back to products an select")
      return
    }

    const orderItem = {
      ...data,
      items: items.map(item => ({
          productId:item.id,
          name:item.name,
          quantity:item.quantity,
          price:item.price
        
      })),
      userId:session?.user?.id
    }

    console.log("order",orderItem);
    

     createOrder.mutate(orderItem)
    
  }

   

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/cart" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        </div>
        
   
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent >
       
                <div  className="space-y-4">
                  <div className="grid grid-clos-1 md:grid-cols-2 gap-2">
                  <FormField
                  name="name"
                  control={form.control}
                  render={({field}) =>(
                    <FormItem>
                      <FormLabel>Fullname</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="enter your fullname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                   />
                    <FormField
                  name="phone"
                  control={form.control}
                  render={({field}) =>(
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="enter your phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                   />

                  </div>
                  <FormField
                  name="email"
                  control={form.control}
                  render={({field}) =>(
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="example@gmail.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                   />
                   <div className="grid grid-clos-1 md:grid-cols-2 gap-2">
                  <FormField
                  name="address"
                  control={form.control}
                  render={({field}) =>(
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                   />
                    <FormField
                  name="postalCode"
                  control={form.control}
                  render={({field}) =>(
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Postal code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                   />

                  </div>
                </div>
                
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Standard Shipping</p>
                          <p className="text-sm text-slate-600">5-7 business days</p>
                        </div>
                        <span className="font-medium">Free</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Express Shipping</p>
                          <p className="text-sm text-slate-600">2-3 business days</p>
                        </div>
                        <span className="font-medium">$15.00</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">${item.price * item.quantity}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span>{getShipping() === 0 ? "Free" : `$${getShipping().toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </>
                  ) : createOrder.isSuccess ? (
                    "Order Placed Successfully!"
                  ) : (
                    "Complete Order"
                  )}
                </Button>

                <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
          </form>
          </Form>
        </div>
    </div>
  )
}
