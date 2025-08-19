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
import { Send, Bot, User, Sparkles, Briefcase, GraduationCap, HeadphonesIcon, Menu, X, Trash2 } from "lucide-react"

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
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

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
    if (activeSessionId === sessionId) {
      setActiveSessionId(null)
    }
  }

  const deleteAllSessions = () => {
    setSessions([])
    setActiveSessionId(null)
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
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: `${roleConfigs[selectedRole].title} Chat`,
        messages: [],
        role: selectedRole,
      }
      setSessions((prev) => [newSession, ...prev])
      setActiveSessionId(newSession.id)
      currentSession = newSession
    }

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSession!.id ? { ...session, messages: [...session.messages, userMessage] } : session,
      ),
    )

    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...currentSession.messages, userMessage],
          role: currentSession.role,
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
          session.id === currentSession!.id
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
          session.id === currentSession!.id ? { ...session, messages: [...session.messages, errorMessage] } : session,
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
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-50 via-white to-slate-100 my-[50px]">
      <div className="w-4/5 mx-auto my-6 h-screen flex flex-col">
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8"></div>
        </div>

        <div className="flex-1 flex gap-3 min-h-0 relative ">
          <Button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="fixed top-12 left-4 z-50 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white shadow-lg my-4"
            size="sm"
          >
            {isSidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>

          <div
            className={`
            flex flex-col gap-4 transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? "w-0 overflow-hidden" : "w-80 min-w-80"}
            md:relative absolute md:translate-x-0 z-40
            ${!isSidebarCollapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          >
            {!isSidebarCollapsed && (
              <>
                <Card className="p-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Choose Your Assistant
                  </h3>
                  <Tabs
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as any)}
                    className="w-full"
                  >
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

                <Card className="flex-1 p-4 shadow-xl border-0 bg-white/80 backdrop-blur-sm min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Recent Chats</h3>
                    <div className="flex gap-1">
                      {sessions.length > 0 && (
                        <Button
                          onClick={deleteAllSessions}
                          className="bg-transparent hover:bg-red-50 text-red-600 p-1 h-auto"
                          size="sm"
                          title="Delete all chats"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {sessions.map((session) => {
                        const config = roleConfigs[session.role]
                        const Icon = config.icon
                        return (
                          <div
                            key={session.id}
                            className={`group relative p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                              activeSessionId === session.id
                                ? "bg-blue-50 border-2 border-blue-200"
                                : "border-2 border-transparent"
                            }`}
                          >
                            <button onClick={() => setActiveSessionId(session.id)} className="w-full text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`p-1 rounded ${config.color} text-white`}>
                                  <Icon className="w-3 h-3" />
                                </div>
                                <span className="font-medium text-sm text-gray-900 truncate flex-1">
                                  {session.title}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">{session.messages.length} messages</div>
                            </button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSession(session.id)
                              }}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-transparent hover:bg-red-50 text-red-600 p-1 h-auto transition-opacity"
                              size="sm"
                              title="Delete chat"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </Card>
              </>
            )}
          </div>

          <div className="flex-1 flex min-h-0 transition-all duration-300">
            <Card className="flex-1 shadow-xl border-0 bg-white/90 backdrop-blur-sm flex flex-col">
              {activeSession ? (
                <>
                  <div className="p-4 md:p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 md:p-3 rounded-xl ${roleConfigs[activeSession.role].color} text-white shadow-lg`}
                      >
                        {(() => {
                          const Icon = roleConfigs[activeSession.role].icon
                          return <Icon className="w-5 h-5 md:w-6 md:h-6" />
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                          {activeSession.title}
                        </h2>
                        <p className="text-sm text-gray-600 truncate">{roleConfigs[activeSession.role].description}</p>
                      </div>
                      <Badge variant="secondary" className="hidden sm:inline-flex">
                        {activeSession.messages.length} messages
                      </Badge>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4 md:p-6">
                    <div className="space-y-4 md:space-y-6">
                      {activeSession.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 md:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="w-8 h-8 md:w-10 md:h-10 shadow-lg flex-shrink-0">
                              <AvatarFallback className={`${roleConfigs[activeSession.role].color} text-white`}>
                                <Bot className="w-4 h-4 md:w-5 md:h-5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                : "bg-white border border-gray-100"
                            }`}
                          >
                            <p
                              className={`${message.role === "user" ? "text-white" : "text-gray-900"} leading-relaxed text-sm md:text-base`}
                            >
                              {message.content}
                            </p>
                            <div
                              className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          {message.role === "user" && (
                            <Avatar className="w-8 h-8 md:w-10 md:h-10 shadow-lg flex-shrink-0">
                              <AvatarFallback className="bg-gray-600 text-white">
                                <User className="w-4 h-4 md:w-5 md:h-5" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-2 md:gap-4 justify-start">
                          <Avatar className="w-8 h-8 md:w-10 md:h-10 shadow-lg">
                            <AvatarFallback className={`${roleConfigs[activeSession.role].color} text-white`}>
                              <Bot className="w-4 h-4 md:w-5 md:h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border border-gray-100 p-3 md:p-4 rounded-2xl shadow-lg">
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

                  <div className="p-3 md:p-4 border-t border-gray-100">
                    <div className="flex gap-2 md:gap-3">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Ask your ${roleConfigs[activeSession.role].title.toLowerCase()}...`}
                        className="flex-1 h-12 md:h-14 px-4 md:px-5 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-colors duration-200 shadow-sm text-sm md:text-base"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="h-12 md:h-14 px-4 md:px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                      >Send 
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                  <div className="text-center">
                    <div className="p-4 md:p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl mb-4 md:mb-6 inline-block">
                      <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      Welcome to AI Assistant Hub
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-md px-4">
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
