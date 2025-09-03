"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive area chart"

const chartConfig = {
  salesData: {
    label: "SalesData",
  },
  sales: {
    label: "Sales",
    color: "var(--primary)",
  },
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
} satisfies ChartConfig

type ChartProps = {
  orders: number;
  month: string;
  sales: number;
}
export function ChartAreaInteractive({data}:{data:ChartProps[]}) {
  
  
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Sales</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the every month
          </span>
          <span className="@[540px]/card:hidden">Total for the every month</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.sales.color}
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.sales.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.orders.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.orders.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
             
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="orders"
              type="natural"
              fill="url(#fillOrders)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillSales)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
