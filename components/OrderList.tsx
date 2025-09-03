"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { format } from "date-fns";
import { OrderItem } from "@prisma/client";
import { IconShoppingCartFilled } from "@tabler/icons-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderWithReviews, STATUS } from "@/app/types/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/lib/apiClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const OrderList = ({ orders }: { orders: orderWithReviews[] }) => {

    const router = useRouter();

    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn:async (data:{id:string,status:STATUS}) =>{
            const res = await api.patch(`orders/${data.id}`,{status:data.status});
            return res.data
        },
        onSuccess:()=>{
            toast.success("order status updated successfully");
            queryClient.invalidateQueries({queryKey:["orders"]});
            router.refresh()
        },
        onError:(err) =>{
            console.log("error",err);
            toast.error("failed order status update")
            
        }
    })


    const handleStatusChange =async (id:string,status:STATUS) =>{

        const data={
            id,status
        }
      updateMutation.mutate(data)
    }

  function calculateOrderTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  return (
    <main className="container p-6">
      <div className="flex  items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Manager</h1>
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
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold text-foreground">{order.id}</h3>
                  <p className="text-muted-foreground">{order.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), "MM/dd/yyyy")} •{" "}
                    {order.items.length} items
                  </p>
                </div>
                <div className="text-right flex  flex-col-reverse md:flex-co gap-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      handleStatusChange(order.id,value as STATUS)
                    }>
                    <SelectTrigger >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="PAID">PAID</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="font-semibold text-foreground">
                    ${calculateOrderTotal(order.items).toLocaleString("US")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconShoppingCartFilled className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Orders Found
              </h3>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default OrderList;
