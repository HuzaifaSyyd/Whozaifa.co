import mongoose from "mongoose"

// Define schemas only if they don't already exist
// This prevents errors when the models are hot reloaded in development

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Blog Schema
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  slug: {
    type: String,
    required: [true, "Please provide a slug"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: [true, "Please provide an excerpt"],
    maxlength: [200, "Excerpt cannot be more than 200 characters"],
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  coverImage: {
    type: String,
    required: [true, "Please provide a cover image"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Export models - handle model compilation more safely
export const User = mongoose.models.User || mongoose.model("User", UserSchema)
export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema)
