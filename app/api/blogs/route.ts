import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Blog, User } from "@/lib/models"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET() {
  try {
    await connectToDatabase()

    const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate("author", "name image")

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Not logged in" }, { status: 401 })
    }

    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin role required" }, { status: 403 })
    }

    const { title, content, excerpt, tags, coverImage } = await request.json()

    if (!title || !content || !excerpt || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the user by ID to ensure they exist
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const slug = slugify(title)

    // Check if a blog with this slug already exists
    const existingBlog = await Blog.findOne({ slug })
    if (existingBlog) {
      // Append a random string to make the slug unique
      const randomString = Math.random().toString(36).substring(2, 8)
      const newSlug = `${slug}-${randomString}`
    }

    const newBlog = new Blog({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      tags: Array.isArray(tags) ? tags : tags.split(",").map((tag) => tag.trim()),
      author: session.user.id,
    })

    await newBlog.save()

    return NextResponse.json({ message: "Blog created successfully", blog: newBlog }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: `Failed to create blog: ${error.message}` }, { status: 500 })
  }
}
