import React from "react";
import prisma from "@/lib/prisma";

import OrderList from "@/components/OrderList";
;

const OrdersPage = async () => {
  const orders = await prisma.order.findMany({
    include: {
      _count: true,
      items: true,
      user: true,
    },
  });
 

  

  return (
   <OrderList orders={orders}  />
  );
};

export default OrdersPage;
