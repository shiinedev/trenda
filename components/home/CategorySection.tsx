'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Smartphone, Shirt, Home, Gamepad2, BookOpen, Dumbbell } from 'lucide-react';
import Image from 'next/image';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Smartphone,
    color: 'bg-blue-500',
    count: '2.5K+ items',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: Shirt,
    color: 'bg-pink-500',
    count: '5K+ items',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: Home,
    color: 'bg-green-500',
    count: '1.2K+ items',
    image: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    color: 'bg-purple-500',
    count: '800+ items',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'books',
    name: 'Books',
    icon: BookOpen,
    color: 'bg-orange-500',
    count: '3K+ items',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: Dumbbell,
    color: 'bg-red-500',
    count: '900+ items',
    image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover thousands of products across all your favorite categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="group p-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fill
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className={`${category.color} p-3 rounded-full mb-2 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-sm text-center">{category.name}</h3>
                      <p className="text-xs opacity-80 mt-1">{category.count}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}