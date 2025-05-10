"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ImageIcon, Bold, Italic, LinkIcon, List } from "lucide-react"
import { useSession } from "next-auth/react"

export default function NewBlogPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const contentRef = useRef(null)

  // Check if user is authenticated and is an admin
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create blog posts.",
        variant: "destructive",
      })
      router.push("/blog")
    } else if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/blog/new")
    }
  }, [status, session, router, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          tags: tags.split(",").map((tag) => tag.trim()),
          coverImage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create blog post")
      }

      toast({
        title: "Success",
        description: "Your blog post has been published successfully!",
      })
      router.push("/blog")
    } catch (error) {
      console.error("Error creating blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatText = (format) => {
    if (!contentRef.current) return

    const textarea = contentRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let formattedText = ""
    let cursorPosition = 0

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        cursorPosition = selectedText.length ? 2 : 2 // Position cursor between ** if no text selected
        break
      case "italic":
        formattedText = `*${selectedText}*`
        cursorPosition = selectedText.length ? 1 : 1 // Position cursor between * if no text selected
        break
      case "link":
        formattedText = `[${selectedText}](url)`
        cursorPosition = selectedText.length ? 3 + selectedText.length : 1 // Position cursor at url
        break
      case "list":
        formattedText = selectedText
          ? selectedText
              .split("\n")
              .map((line) => `- ${line}`)
              .join("\n")
          : "- "
        cursorPosition = selectedText.length ? 2 : 2 // Position cursor after -
        break
      case "image":
        formattedText = `![${selectedText}](image_url)`
        cursorPosition = selectedText.length ? 4 + selectedText.length : 2 // Position cursor at image_url
        break
      default:
        formattedText = selectedText
        cursorPosition = 0
    }

    // Update content
    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus()
      if (selectedText) {
        // If text was selected, place cursor at the end of the formatted text
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
      } else {
        // If no text was selected, place cursor at the appropriate position within the formatting
        textarea.setSelectionRange(start + cursorPosition, start + cursorPosition)
      }
    }, 0)
  }

  if (status === "loading" || (status === "authenticated" && session?.user?.role !== "admin")) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>

            <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  required
                  className="rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of your blog post"
                  required
                  rows={3}
                  className="rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="next.js, react, web development"
                  required
                  className="rounded-md"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content">Content</Label>
                  <div className="flex space-x-1">
                    <Button type="button" variant="outline" size="icon" onClick={() => formatText("bold")} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => formatText("italic")}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => formatText("link")} title="Link">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => formatText("list")} title="List">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => formatText("image")}
                      title="Image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="content"
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  required
                  rows={15}
                  className="font-mono rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.push("/blog")} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Publishing...
                    </span>
                  ) : (
                    "Publish Post"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
