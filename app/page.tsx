import { Footer } from "@/components/layout/Footer"
import CategorySection from "@/components/home/CategorySection"
import HeroSection from "@/components/home/HeroSection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import { Navigation } from "@/components/layout/Navigation"
import prisma from "@/lib/prisma"

export default async function HomePage() {

  const products = await prisma.product.findMany({
    include:{
       category:true,
       images:true,
       reviews:true
    }
  })

  return (
    <div className="min-h-screen">
       <Navigation />
      <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
    <FeaturedProducts products={products}  />

      {/* Categories */}
     <CategorySection />
     </main>
      <Footer />
    </div>
  )
}
