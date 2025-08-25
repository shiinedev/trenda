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

    image: 'https://images.pexels.com/photos/3945653/pexels-photo-3945653.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageAlt: "Premium Wireless Headphones",
    backgroundColor: "bg-slate-100",
  },
  {
    id: 2,
    badge: "New Arrival - Smart Tech",
    title: "Track Your Fitness Goals -",
    subtitle: "Advanced Smart Watch Collection!",
    image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageAlt: "Smart Fitness Watch",
    backgroundColor: "bg-blue-50",
  },
  {
    id: 3,
    badge: "Best Seller - Premium Quality",
    title: "Elevate Your Home -",
    subtitle: "Smart Home Devices Collection!",
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageAlt: "Smart Home Devices",
    backgroundColor: "bg-purple-50",
  },
  {
    id: 4,
    badge: "Gaming Special - Up to 40% Off",
    title: "Level Up Your Game -",
    subtitle: "Professional Gaming Gear!",
    image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=400',
    imageAlt: "Gaming Equipment",
    backgroundColor: "bg-green-50",
  },
]

export default function HeroSection() {
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-sm font-medium animate-fade-in">
                {currentSlideData.badge}
              </Badge>
              <div className="animate-slide-up">
                <h1 className="text-xl lg:text-2xl font-bold leading-tight text-slate-900">
                  {currentSlideData.title}
                  {currentSlideData.subtitle && <span className="block">{currentSlideData.subtitle}</span>}
                </h1>
                {currentSlideData.description && (
                  <p className="text-sm text-slate-600 mt-4 leading-relaxed">{currentSlideData.description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start animate-slide-up">
              <Link href={"/"}>
                <Button
                  size="lg"
                >
                  view Details
                </Button>
              </Link>
              <Link href={"/"}>
                <Button
                  size="lg"
                  variant="outline"
                >
                  Learn more
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative animate-fade-in">
            <Image
                src={currentSlideData.image}
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
