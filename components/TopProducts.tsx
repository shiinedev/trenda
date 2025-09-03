import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

type TopSells ={
    id: string;
    image: string;
    name: string;
    orderCount:1,
    price:number,
    quantitySold:number,
    revenue:number
  }
  
const TopProducts = ({data}:{data:TopSells[]}) => {
  return (
    <div>
       <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium text-sm text-card-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.quantitySold} sales • ${product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
    </div>
  )
}

export default TopProducts
