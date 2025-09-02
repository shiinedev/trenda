import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import prisma from "@/lib/prisma";

export default async function Page() {
  const [products, orders, orderItems] = await Promise.all([
    prisma.product.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
  ]);

  const totalRevenue = orderItems.reduce((total, i) => total + i.price, 0);

  const data = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards data={data} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
    </div>
  );
}
