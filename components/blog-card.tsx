"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function BlogCard({ blog, isAdmin = false }) {
  const formattedDate = blog.createdAt ? formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true }) : "Recently"
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (e) => {
    e.preventDefault()
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const res = await fetch(`/api/blogs/${blog._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error("Failed to delete blog post")
        }

        toast({
          title: "Success",
          description: "Blog post deleted successfully!",
        })

        // Refresh the page to update the list
        router.refresh()
      } catch (error) {
        console.error("Error deleting blog post:", error)
        toast({
          title: "Error",
          description: "Failed to delete blog post. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <motion.div
      className="group h-full flex flex-col overflow-hidden rounded-2xl border bg-background/50 transition-all hover:shadow-md glass modern-card"
      whileHover={{ y: -5 }}
    >
      <Link href={`/blog/${blog.slug}`} className="overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={blog.coverImage || "/placeholder.svg?height=400&width=600"}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2">
          {blog.tags &&
            blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          {blog.tags && blog.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{blog.tags.length - 2} more</span>
          )}
        </div>
        <Link href={`/blog/${blog.slug}`} className="group-hover:underline">
          <h3 className="mb-2 text-xl font-semibold tracking-tight">{blog.title}</h3>
        </Link>
        <p className="mb-4 flex-1 text-muted-foreground">{blog.excerpt}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={blog.author?.image || "/favicon.jpg"}
              alt={blog.author?.name || "Author"}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{blog.author?.name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/blog/edit/${blog._id}`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
