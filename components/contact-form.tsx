"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"
import emailjs from "@emailjs/browser"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
  
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const replyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_REPLY_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  
    if (!serviceId || !templateId || !replyTemplateId || !publicKey) {
      toast({
        title: "Email config error",
        description: "Missing or invalid EmailJS environment variables.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }
  
    try {
      // Send message to your inbox
      const res1 = await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey
      )
  
      console.log("Primary email response:", res1)
  
      // Optional: check for successful status
      if (res1.status !== 200) {
        throw new Error("Primary email send failed.")
      }
  
      // Send auto-reply to user
      const res2 = await emailjs.send(
        serviceId,
        replyTemplateId,
        {
          to_name: formData.name,
          to_email: formData.email,  // <- this is sent to EmailJS
        },
        publicKey
      )
  
      console.log("Reply email response:", res2)
  
      if (res2.status !== 200) {
        throw new Error("Reply email send failed.")
      }
  
      toast({
        title: "Message sent!",
        description: "Thanks for contacting us. We'll reply soon.",
      })
  
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Email sending error:", error)
      toast({
        title: "Sending failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="rounded-md bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your email"
            className="rounded-md bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Your phone number"
            className="rounded-md bg-background/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="Subject"
          className="rounded-md bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Your message"
          className="rounded-md bg-background/50"
        />
      </div>

      <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1 5.8 3 8l3-2.7z" />
            </svg>
            Sending...
          </span>
        ) : (
          <span className="flex items-center">
            Send Message <Send className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  )
}
