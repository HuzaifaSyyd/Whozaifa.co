import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Blog } from "@/lib/models"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { slugify } from "@/lib/utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Check if the ID is a valid MongoDB ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);

    let query = {};
    if (isObjectId) {
      query = { _id: params.id };
    } else {
      query = { slug: params.id };
    }
  
    const blog = await Blog.findOne(query).populate("author", "name image");
  
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, excerpt, tags, coverImage } = await request.json()

    if (!title || !content || !excerpt || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const blog = await Blog.findById(params.id)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Update slug only if title changed
    const slug = title !== blog.title ? slugify(title) : blog.slug

    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        tags: Array.isArray(tags) ? tags : tags.split(",").map((tag) => tag.trim()),
        updatedAt: Date.now(),
      },
      { new: true },
    )

    return NextResponse.json({ message: "Blog updated successfully", blog: updatedBlog })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const blog = await Blog.findById(params.id)

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    await Blog.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
