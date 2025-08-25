import { Footer } from "@/components/layout/Footer"
import CategorySection from "@/components/home/CategorySection"
import HeroSection from "@/components/home/HeroSection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import { Navigation } from "@/components/layout/Navigation"

export default  function HomePage() {


  return (
    <div className="min-h-screen">
       <Navigation />
      <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
    <FeaturedProducts  />

      {/* Categories */}
     <CategorySection />
     </main>
      <Footer />
    </div>
  )
}
