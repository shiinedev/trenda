"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface HeroSlide {
  id: number
  badge: string
  title: string
  subtitle?: string
  description?: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton: {
    text: string
    href: string
  }
  image: string
  imageAlt: string
  backgroundColor: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    badge: "Limited Time Offer 30% Off",
    title: "Experience Pure Sound -",
    subtitle: "Your Perfect Headphones Awaits!",
    primaryButton: {
      text: "Buy now",
      href: "/products?category=electronics",
    },
    secondaryButton: {
      text: "Find more",
      href: "/products",
    },
    image: "/placeholder.svg?height=400&width=400&text=Premium+Headphones",
    imageAlt: "Premium Wireless Headphones",
    backgroundColor: "bg-slate-100",
  },
  {
    id: 2,
    badge: "New Arrival - Smart Tech",
    title: "Track Your Fitness Goals -",
    subtitle: "Advanced Smart Watch Collection!",
    primaryButton: {
      text: "Shop Now",
      href: "/products?category=fitness",
    },
    secondaryButton: {
      text: "Learn More",
      href: "/products",
    },
    image: "/placeholder.svg?height=400&width=400&text=Smart+Watch",
    imageAlt: "Smart Fitness Watch",
    backgroundColor: "bg-blue-50",
  },
  {
    id: 3,
    badge: "Best Seller - Premium Quality",
    title: "Elevate Your Home -",
    subtitle: "Smart Home Devices Collection!",
    primaryButton: {
      text: "Explore",
      href: "/products?category=home",
    },
    secondaryButton: {
      text: "View All",
      href: "/products",
    },
    image: "/placeholder.svg?height=400&width=400&text=Smart+Home",
    imageAlt: "Smart Home Devices",
    backgroundColor: "bg-purple-50",
  },
  {
    id: 4,
    badge: "Gaming Special - Up to 40% Off",
    title: "Level Up Your Game -",
    subtitle: "Professional Gaming Gear!",
    primaryButton: {
      text: "Game On",
      href: "/products?category=gaming",
    },
    secondaryButton: {
      text: "Browse",
      href: "/products",
    },
    image: "/placeholder.svg?height=400&width=400&text=Gaming+Setup",
    imageAlt: "Gaming Equipment",
    backgroundColor: "bg-green-50",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className={`relative ${currentSlideData.backgroundColor} overflow-hidden transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-medium animate-fade-in">
                {currentSlideData.badge}
              </Badge>
              <div className="animate-slide-up">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-slate-900">
                  {currentSlideData.title}
                  {currentSlideData.subtitle && <span className="block">{currentSlideData.subtitle}</span>}
                </h1>
                {currentSlideData.description && (
                  <p className="text-lg text-slate-600 mt-4 leading-relaxed">{currentSlideData.description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start animate-slide-up">
              <Link href={currentSlideData.primaryButton.href}>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  {currentSlideData.primaryButton.text}
                </Button>
              </Link>
              <Link href={currentSlideData.secondaryButton.href}>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-slate-700 hover:text-slate-900 p-0 h-auto font-medium text-lg group"
                >
                  {currentSlideData.secondaryButton.text}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative animate-fade-in">
              <Image
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.imageAlt}
                width={400}
                height={400}
                className="w-full max-w-md h-auto object-contain transition-all duration-500"
                priority
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Slider Dots */}
        <div className="flex justify-center space-x-3 mt-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-blue-600 scale-125" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></div>
              )}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-100 ease-linear"
            style={{
              width: isAutoPlaying ? `${((currentSlide + 1) / heroSlides.length) * 100}%` : "0%",
            }}
          ></div>
        </div>
      </div>

      {/* Slide Indicator */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-slate-700">
        {currentSlide + 1} / {heroSlides.length}
      </div>
    </section>
  )
}
