import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./lib/provider"



const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Trenda - Smart Shopping Experience",
  description: "Next-generation e-commerce powered by artificial intelligence",
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>

        <Providers>
        <main className="min-h-screen"> {children}</main>
        </Providers>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  )
}
