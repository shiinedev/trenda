export const getAverageRating = (reviews: { rating: number }[])  =>{
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  }
  