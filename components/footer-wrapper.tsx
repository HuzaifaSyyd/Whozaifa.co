"use client"

import { usePathname } from "next/navigation"
import Footer from "@/components/footer"

export default function FooterWrapper() {
  const pathname = usePathname()

  // Hide footer only on /ai-chat
  if (pathname === "/ai-chat") {
    return null
  }

  return <Footer />
}
