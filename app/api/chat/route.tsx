import { type NextRequest, NextResponse } from "next/server"
import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const rolePrompts = {
  support:
    'You are a helpful customer support agent. Answer questions about services, pricing, policies, and troubleshooting in a clear, concise, and professional way. Always maintain a polite and friendly tone. If you are unsure about something, say "I don\'t have that information right now."',
  teacher:
    "You are an expert teacher and explainer. Break down technical or difficult concepts (like coding, AI, web development) into easy-to-understand explanations with examples. Make learning engaging and accessible. Use simple language unless the user requests detail. Format your answers in a readable way with short paragraphs and bullet points when useful.",
  assistant:
    "You are a friendly and helpful general assistant. Engage in friendly conversation, provide helpful tips, and give structured guidance. Always be concise and to the point. Stay helpful, polite, and respectful at all times. Avoid unnecessary jargon and keep language simple.",
}

export async function POST(request: NextRequest) {
  try {
    const { messages, role } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const systemPrompt = rolePrompts[role as keyof typeof rolePrompts] || rolePrompts.assistant

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
