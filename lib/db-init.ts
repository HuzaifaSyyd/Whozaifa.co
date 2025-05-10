import { hash } from "bcrypt"
import { connectToDatabase } from "./mongodb"
import { User } from "./models"

export async function initializeDatabase() {
  try {
    await connectToDatabase()

    // Check if admin user exists
    const adminExists = await User.findOne({ role: "admin" })

    if (!adminExists) {
      console.log("Creating admin user...")

      // Create admin user
      const hashedPassword = await hash("admin123", 12)

      const adminUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      })

      await adminUser.save()
      console.log("Admin user created successfully")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}
