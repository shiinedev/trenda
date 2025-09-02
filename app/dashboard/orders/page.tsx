import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { OrderItem } from '@prisma/client';
import { IconShoppingCartFilled } from '@tabler/icons-react';

const OrdersPage = async () => {

    const orders = await prisma.order.findMany({
        include: {
            _count: true,
            items: true,
            user: true
        }
    })

     function calculateOrderTotal(items: OrderItem[]): number {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      }
    

    return (
        <main className="container p-6">
            <div className="flex  items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Order Manager</h1>
                    <p className="text-muted-foreground mt-2">Manage your Orders</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{order.id}</h3>
                                    <p className="text-slate-600">{order.user.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {format(new Date(order.createdAt),"MM/dd/yyyy")} • {order.items.length} items
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-900">${calculateOrderTotal(order.items).toLocaleString("US")}</p>
                                    <Badge
                                        variant={
                                            order.status === "DELIVERED"
                                                ? "default"
                                                : order.status === "SHIPPED"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                    {
                        orders.length === 0 && (
                            <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                              <IconShoppingCartFilled className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Orders Found</h3>
                          </div>
                        )
                    }
                </CardContent>
            </Card>

           
        </main>
    )
}

export default OrdersPage







