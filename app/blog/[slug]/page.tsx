"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

export default function BlogPostPage() {
  const params = useParams()
  const { slug } = params
  const { data: session } = useSession()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blogs/${slug}`)

        if (!res.ok) {
          if (res.status === 404) {
            toast({
              title: "Not Found",
              description: "The blog post you're looking for doesn't exist.",
              variant: "destructive",
            })
            setBlog(null)
            return
          }
          throw new Error("Failed to fetch blog post")
        }

        const data = await res.json()
        setBlog(data)
      } catch (error) {
        console.error("Error fetching blog post:", error)
        toast({
          title: "Error",
          description: "Failed to load blog post. Please try again later.",
          variant: "destructive",
        })
        setBlog(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBlog()
    }
  }, [slug, toast])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formattedDate = blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) : "Recently"

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>

            <div className="mb-8">
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {blog.title}
              </motion.h1>
              <motion.div
                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center">
                  <img
                    src={blog.author?.image || "/placeholder.svg?height=100&width=100"}
                    alt={blog.author?.name || "Author"}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <span>{blog.author?.name || "Anonymous"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>5 min read</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="aspect-video w-full overflow-hidden rounded-2xl mb-8 glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <img
                src={blog.coverImage || "/placeholder.svg?height=400&width=600"}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {blog.tags &&
                blog.tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </motion.span>
                ))}
            </motion.div>

            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, "<br>") }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
