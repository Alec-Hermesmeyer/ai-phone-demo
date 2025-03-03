"use client"

import { useState } from "react"
import { Phone, User, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { useChat } from "ai/react"
import { searchDocuments } from "@/lib/api"
import { formatKnowledgeResponse } from "@/lib/format-response"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function CallSimulator() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSearching) return

    const userMessage = input
    setInput("") // Clear input immediately

    try {
      setIsSearching(true)
      // Add user message immediately
      setMessages((current) => [
        ...current,
        {
          id: Date.now().toString(),
          role: "user",
          content: userMessage,
        },
      ])

      // Search for relevant documents
      const searchResults = await searchDocuments(userMessage)

      if (searchResults.results.length === 0) {
        setMessages((current) => [
          ...current,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "I apologize, but I don't have specific information about that. Let me transfer you to a human agent who can help you better.",
          },
        ])
        return
      }

      // Format the context from search results
      const context = searchResults.results
        .map((doc) => {
          const question = doc.metadata.question || "Information"
          return `${question}: ${doc.content}`
        })
        .join("\n\n")

      // Format the response using AI
      const formattedResponse = await formatKnowledgeResponse(context, userMessage)

      // Add AI response
      setMessages((current) => [
        ...current,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: formattedResponse,
        },
      ])
    } catch (error) {
      console.error("Error in call simulator:", error)
      setMessages((current) => [
        ...current,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I apologize, but I'm having trouble accessing the information. Let me transfer you to a human agent.",
        },
      ])
    } finally {
      setIsSearching(false)
    }
  }

  const handleStartCall = () => {
    setIsCallActive(true)
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Hello! Thank you for calling. How can I assist you today?",
      },
    ])
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setMessages([])
    setInput("")
    setIsSearching(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Simulator</CardTitle>
        <CardDescription>Test how the AI system handles different customer inquiries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isCallActive ? (
            <Button className="w-full" size="lg" onClick={handleStartCall}>
              <Phone className="mr-2 h-4 w-4" />
              Start Test Call
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="h-[400px] border rounded-lg p-4 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 mb-4 ${message.role === "user" ? "justify-end" : ""}`}>
                    {message.role !== "user" && <Phone className="h-8 w-8 p-2 border rounded-full shrink-0" />}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && <User className="h-8 w-8 p-2 border rounded-full shrink-0" />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isSearching}
                />
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                </Button>
              </form>

              <Button variant="destructive" className="w-full" onClick={handleEndCall}>
                End Call
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
