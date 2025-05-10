"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { signOut, useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/#about" },
  { name: "Services", path: "/#services" },
  { name: "Portfolio", path: "/#portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/#contact" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      await signOut({ redirect: false })
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isAdmin = session?.user?.role === "admin"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="font-bold text-xl text-gradient">
            Whozaifa.co<span className="text-primary"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.path ? "text-primary" : "text-foreground/80"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="ml-4 flex items-center space-x-2">
              <ThemeToggle />

              {status === "authenticated" && (
                <Button asChild className="ai-button">
                  <Link href="/ai-chat">
                    <Sparkles className="mr-2 h-4 w-4" /> AI Chat
                  </Link>
                </Button>
              )}

              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              )}

              {status === "authenticated" ? (
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-full">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === item.path ? "text-primary" : "text-foreground/80"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 flex flex-col space-y-2">
                  {status === "authenticated" && (
                    <Button asChild className="ai-button">
                      <Link href="/ai-chat">
                        <Sparkles className="mr-2 h-4 w-4" /> AI Chat
                      </Link>
                    </Button>
                  )}

                  {isAdmin && (
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  )}

                  {status === "authenticated" ? (
                    <Button variant="outline" className="rounded-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="rounded-full">
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
