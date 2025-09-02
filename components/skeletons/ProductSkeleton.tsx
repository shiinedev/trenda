import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="group p-0 overflow-hidden rounded-xl shadow-sm">
          <div className="relative aspect-square overflow-hidden h-24">
            <Skeleton className="w-full h-full" />
          </div>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

  )
}

export function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="group p-0 overflow-hidden rounded-xl shadow-sm">
          <div className="flex p-4 space-x-4">
            <Skeleton className="w-[100px] h-[100px] rounded-lg flex-shrink-0" />
            <CardContent className="flex-1 space-y-2 p-0">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
