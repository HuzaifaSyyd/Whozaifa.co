import type React from "react"
import { Inter, Sankofa_Display as SF_Pro_Display } from "next/font/google"
import { Providers } from "@/components/providers"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Load SF Pro Display for Apple-like aesthetics
const sfPro = SF_Pro_Display({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400"],
})

// Keep Inter as fallback
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata = {
  title: "Whozaifa",
  description: "Professional portfolio website showcasing my work and services",
    generator: 'Huzaifa_Syyd',
    icons: {
      icon: { url: '/favicon.jpg' }, // Or the path to your icon.png or other file
    },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sfPro.variable} ${inter.variable}`}>
      <body className="font-sf-pro antialiased">
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
