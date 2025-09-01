import { Skeleton } from "@/components/ui/skeleton"

export function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2">
            {/* Avatar */}
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex-1 space-y-2">
              {/* Name */}
              <Skeleton className="h-4 w-32" />
              
              {/* Rating + Date */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                  ))}
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Comment */}
          <Skeleton className="h-4 w-[80%] mt-3 ml-4" />
          <Skeleton className="h-4 w-[60%] ml-4" />
        </div>
      ))}
    </div>
  )
}
