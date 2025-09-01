import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Star, User2 } from 'lucide-react'
import React from 'react'
import ReviewsForm from './ReviewsForm'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/app/lib/apiClient'
import { ReviewWithRelations } from '@/app/types/prisma'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAverageRating } from '@/app/lib/getAverageRating'
import { ReviewsSkeleton } from '@/components/skeletons/ReviewSkeleton'


const Reviews = ({ id }: { id: string }) => {

  const { data, isPending } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await api.get(`/reviews/${id}`);
      return res.data
    },
    retry: 1
  })




  const reviews:ReviewWithRelations[] = data?.reviews ?? []
  const ratingSummary = data?.ratingSummary ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Review Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <ReviewsForm productId={id} />
          </div>

          {/* Review Summary */}
          <div className="flex items-center space-x-6 p-4 bg-slate-50 rounded-lg mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">{getAverageRating(reviews).toFixed(1)}</div>
              <div className="flex items-center justify-center space-x-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(getAverageRating(reviews))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                      }`}
                  />
                ))}
              </div>
              <div className="text-sm text-slate-600 mt-1">{reviews?.length} reviews</div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingSummary[rating] || 0;
                const percentage = reviews?.length ? (count / reviews?.length) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-slate-600 w-8">{rating}★</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">

            {
              isPending ?
              <ReviewsSkeleton />
              :
            reviews.slice(0,3).map((review: ReviewWithRelations) => (
              <div key={review.id} className="border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={review?.user?.image ?? undefined} />
                    <AvatarFallback>
                      {review?.user?.name
                        ? review.user.name
                          .split(" ") 
                          .map(n => n[0]) 
                          .join("") 
                          .toUpperCase()
                        : <User2 />}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-slate-900">{review.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">{formatDistanceToNow(review.createdAt, { addSuffix: true })}</span>
                    </div>
                  </div>


                </div>
                <p className="text-slate-600 mb-3 leading-relaxed ml-4">&quot;{review.comment}&quot;</p>
              </div>
            ))}
          </div>


          {/* Load More Reviews */}
          {reviews.length > 3 && (
            <div className="text-center pt-6">
              <Button variant="outline" className="bg-transparent">
                Load More Reviews
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Reviews


