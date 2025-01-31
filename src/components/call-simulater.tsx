"use client"

import { useState } from "react"
import { Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useChat } from "ai/react"

export function CallSimulator() {
  const [isCallActive, setIsCallActive] = useState(false)
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Simulator</CardTitle>
        <CardDescription>Test how the AI system handles different customer inquiries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isCallActive ? (
            <Button className="w-full" size="lg" onClick={() => setIsCallActive(true)}>
              <Phone className="mr-2 h-4 w-4" />
              Start Test Call
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="h-[400px] border rounded-lg p-4 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 mb-4 ${message.role === "user" ? "justify-end" : ""}`}>
                    {message.role !== "user" && <Phone className="h-8 w-8 p-2 border rounded-full" />}
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && <User className="h-8 w-8 p-2 border rounded-full" />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input placeholder="Type your message..." value={input} onChange={handleInputChange} />
                <Button type="submit">Send</Button>
              </form>

              <Button variant="destructive" className="w-full" onClick={() => setIsCallActive(false)}>
                End Call
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

