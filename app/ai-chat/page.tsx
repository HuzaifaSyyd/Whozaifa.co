"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Sparkles, CalendarClock, Bell, Zap, Lightbulb, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AIChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in
  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/ai-chat")
    return null
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>

          <h1 className="text-3xl font-bold mb-2">AI Chat Assistant</h1>
          <p className="text-muted-foreground">Coming Soon - Your personal AI assistant is almost ready!</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass p-8 rounded-2xl mb-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Chat Coming Soon</h2>
                <p className="text-muted-foreground">We're putting the finishing touches on our AI assistant</p>
              </div>
            </div>

            <p className="mb-6">
              Our advanced AI chat assistant is currently in the final stages of development. Soon, you'll be able to:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Natural Conversations</h3>
                  <p className="text-sm text-muted-foreground">Chat naturally with our AI assistant about any topic</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Creative Assistance</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help with creative writing, ideas, and brainstorming
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Instant Answers</h3>
                  <p className="text-sm text-muted-foreground">
                    Get quick answers to your questions and solutions to problems
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Personalized Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications and updates tailored to your interests
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <CalendarClock className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Latest Update</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Our team is currently fine-tuning the AI model to ensure it provides accurate and helpful responses.
                We're also implementing advanced features like image recognition and code assistance.
              </p>
              <p className="text-sm font-medium">Expected launch: Q3 2023</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-muted-foreground mb-6">
              Want to be notified when our AI assistant launches? Subscribe to our newsletter!
            </p>
            <Button className="ai-button">
              <Bell className="mr-2 h-4 w-4" /> Get Notified
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
