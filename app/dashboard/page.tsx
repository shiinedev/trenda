import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import TopProducts from "@/components/TopProducts";
import prisma from "@/lib/prisma";

export default async function Page() {
 

  const [overviewStats, salesDataRaw, topProductsRaw, totalProducts] =
    await Promise.all([
      // Get overview statistics in one aggregation
      prisma.order.aggregateRaw({
        pipeline: [
          {
            $match: {
              status: { $in: ["PAID", "DELIVERED", "SHIPPED"] },
            },
          },
          {
            $lookup: {
              from: "OrderItem",
              localField: "_id",
              foreignField: "orderId",
              as: "items",
            },
          },
          {
            $addFields: {
              orderTotal: {
                $sum: {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: { $multiply: ["$$item.price", "$$item.quantity"] },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: "$orderTotal" },
              averageOrderValue: { $avg: "$orderTotal" },
            },
          },
        ],
      }),

      // Monthly sales data aggregation
      prisma.order.aggregateRaw({
        pipeline: [
          {
            $match: {
              status: { $in: ["PAID", "DELIVERED", "SHIPPED"] },
            },
          },
          {
            $lookup: {
              from: "OrderItem",
              localField: "_id",
              foreignField: "orderId",
              as: "items",
            },
          },
          {
            $addFields: {
              orderTotal: {
                $sum: {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: { $multiply: ["$$item.price", "$$item.quantity"] },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: {
                month: { $dateToString: { format: "%b", date: "$createdAt" } },
                monthNum: { $month: "$createdAt" },
              },
              sales: { $sum: "$orderTotal" },
              orders: { $sum: 1 },
            },
          },
          {
            $sort: { "_id.monthNum": 1 },
          },
          {
            $project: {
              _id: 0,
              month: "$_id.month",
              sales: { $round: ["$sales", 0] },
              orders: 1,
            },
          },
        ],
      }),

      // Top selling products aggregation
      prisma.orderItem.aggregateRaw({
        pipeline: [
          {
            $lookup: {
              from: 'Order',
              localField: 'orderId',
              foreignField: '_id',
              as: 'order'
            }
          },
          {
            $match: {
              'order.status': { $in: ['PAID', 'DELIVERED',"SHIPPED"] }
            }
          },
          {
            $group: {
              _id: '$productId',
              name: { $first: '$name' },
              totalQuantity: { $sum: '$quantity' },
              totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } },
              orderCount: { $sum: 1 }
            }
          },
          {
            $sort: { totalQuantity: -1 }
          },
          {
            $limit: 5
          },
          {
            $lookup: {
              from: 'Product',
              localField: '_id',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $lookup: {
              from: 'ProductImage',
              localField: '_id',
              foreignField: 'productId',
              as: 'images'
            }
          },
          {
            $project: {
              _id: 0,
              id: '$_id',
              name: 1,
              quantitySold: '$totalQuantity',
              revenue: { $round: ['$totalRevenue', 0] },
              orderCount: 1,
              price: { $arrayElemAt: ['$product.price', 0] },
              image: { $arrayElemAt: ['$images.url', 0] }
            }
          }
        ]
      }),

      prisma.product.count(),
    ]);


  const overview = overviewStats as unknown as Array<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }>;
  const salesData = salesDataRaw as unknown as Array<{
    orders: number;
    month: string;
    sales: number;
  }>;

  const topSells = topProductsRaw as unknown as Array<{
    id: string;
    image: string;
    name: string;
    orderCount:1,
    price:number,
    quantitySold:number,
    revenue:number
  }>;
  

  const data = {
    totalProducts,
    totalOrders: overview[0]?.totalOrders ?? 0,
    totalRevenue: Math.round(overview[0]?.totalRevenue ?? 0),
    averageOrderValue: Math.round(overview[0]?.averageOrderValue ?? 0),
  };

  console.log(topSells);
  


  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards data={data} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive data={salesData} />
        </div>
        <div className="px-4 lg:px-6">
          <TopProducts data={topSells} />
        </div>
      </div>
    </div>
  );
}




