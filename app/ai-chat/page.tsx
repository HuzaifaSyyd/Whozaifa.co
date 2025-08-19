"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, Briefcase, GraduationCap, HeadphonesIcon } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  role: "support" | "teacher" | "assistant"
}

const roleConfigs = {
  support: {
    title: "Customer Support",
    description: "Get help with services.",
    icon: HeadphonesIcon,
    color: "bg-blue-500",
    prompt:
      "You are a helpful customer support agent. Answer questions about services, pricing, policies, and troubleshooting in a clear and professional way.",
  },
  teacher: {
    title: "AI Teacher",
    description: "Learn complex topics.",
    icon: GraduationCap,
    color: "bg-green-500",
    prompt:
      "You are an expert teacher. Break down complex concepts into easy-to-understand explanations with examples. Make learning engaging and accessible.",
  },
  assistant: {
    title: "General Assistant",
    description: "Friendly conversations.",
    icon: Briefcase,
    color: "bg-purple-500",
    prompt:
      "You are a friendly and helpful general assistant. Provide guidance, tips, and engage in meaningful conversation while being professional and supportive.",
  },
}

export default function ModernChatbot() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"support" | "teacher" | "assistant">("assistant")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
  const saved = localStorage.getItem("chatSessions")
  if (saved) {
    setSessions(JSON.parse(saved))
  }
}, [])

// Save sessions to localStorage whenever they update
useEffect(() => {
  if (sessions.length > 0) {
    localStorage.setItem("chatSessions", JSON.stringify(sessions))
  }
}, [sessions])

  useEffect(() => {
    scrollToBottom()
  }, [activeSession?.messages])

  const createNewSession = (role: "support" | "teacher" | "assistant") => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `${roleConfigs[role].title} Chat`,
      messages: [],
      role,
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newSession.id)
    setSelectedRole(role)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    let currentSession = activeSession
    if (!currentSession) {
      createNewSession(selectedRole)
      currentSession = {
        id: Date.now().toString(),
        title: `${roleConfigs[selectedRole].title} Chat`,
        messages: [],
        role: selectedRole,
      }
      setSessions((prev) => [currentSession!, ...prev])
      setActiveSessionId(currentSession.id)
    }

    // Add user message
    setSessions((prev) =>
      prev.map((session) =>
        session.id === (currentSession?.id || activeSessionId)
          ? { ...session, messages: [...session.messages, userMessage] }
          : session,
      ),
    )

    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...(currentSession?.messages || []), userMessage],
          role: currentSession?.role || selectedRole,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
      }

      setSessions((prev) =>
        prev.map((session) =>
          session.id === (currentSession?.id || activeSessionId)
            ? { ...session, messages: [...session.messages, assistantMessage] }
            : session,
        ),
      )
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }

      setSessions((prev) =>
        prev.map((session) =>
          session.id === (currentSession?.id || activeSessionId)
            ? { ...session, messages: [...session.messages, errorMessage] }
            : session,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto max-w-6xl p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            
          
          </div>
          
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Sidebar */}
          <div className="w-80 flex flex-col gap-4">
            {/* Role Selection */}
            <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Choose Your Assistant
              </h3>
              <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-1 gap-2 h-auto bg-transparent p-0">
                  {Object.entries(roleConfigs).map(([key, config]) => {
                    const Icon = config.icon
                    return (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 border-transparent data-[state=active]:border-blue-200 data-[state=active]:bg-blue-50 hover:bg-gray-50 transition-all duration-200 justify-start h-auto"
                      >
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{config.title}</div>
                          <div className="text-xs text-gray-500">{config.description}</div>
                        </div>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </Tabs>
              <Button
                onClick={() => createNewSession(selectedRole)}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start New Chat
              </Button>
            </Card>

            {/* Chat History */}
            <Card className="flex-1 p-4 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Chats</h3>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {sessions.map((session) => {
                    const config = roleConfigs[session.role]
                    const Icon = config.icon
                    return (
                      <button
                        key={session.id}
                        onClick={() => setActiveSessionId(session.id)}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                          activeSessionId === session.id
                            ? "bg-blue-50 border-2 border-blue-200"
                            : "border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`p-1 rounded ${config.color} text-white`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="font-medium text-sm text-gray-900 truncate">{session.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">{session.messages.length} messages</div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex  min-h-0">
            <Card className="flex-1 shadow-xl border-0 bg-white/90 backdrop-blur-sm flex flex-col">
              {activeSession ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${roleConfigs[activeSession.role].color} text-white shadow-lg`}>
                        {(() => {
                          const Icon = roleConfigs[activeSession.role].icon
                          return <Icon className="w-6 h-6" />
                        })()}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{activeSession.title}</h2>
                        <p className="text-gray-600">{roleConfigs[activeSession.role].description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {activeSession.messages.length} messages
                      </Badge>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {activeSession.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="w-10 h-10 shadow-lg">
                              <AvatarFallback className={`${roleConfigs[activeSession.role].color} text-white`}>
                                <Bot className="w-5 h-5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[70%] p-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                : "bg-white border border-gray-100"
                            }`}
                          >
                            <p
                              className={`${message.role === "user" ? "text-white" : "text-gray-900"} leading-relaxed`}
                            >
                              {message.content}
                            </p>
                            <div
                            className={`text-xs mt-2 ${
                              message.role === "user" ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="w-10 h-10 shadow-lg">
                              <AvatarFallback className="bg-gray-600 text-white">
                                <User className="w-5 h-5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-4 justify-start">
                          <Avatar className="w-10 h-10 shadow-lg">
                            <AvatarFallback className={`${roleConfigs[activeSession.role].color} text-white`}>
                              <Bot className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-lg">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-6 border-t border-gray-100">
                    <div className="flex gap-3">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Ask your ${roleConfigs[activeSession.role].title.toLowerCase()}...`}
                        className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-colors duration-200 shadow-sm"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-6 inline-block">
                      <Sparkles className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to AI Assistant Hub</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Choose your assistant type and start a conversation. Get professional help tailored to your needs.
                    </p>
                    <Button
                      onClick={() => createNewSession(selectedRole)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Start Your First Chat
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
