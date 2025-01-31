"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

export function KnowledgeBase() {
  const [items, setItems] = useState([
    {
      id: 1,
      question: "What tours do you offer?",
      answer:
        "We offer several boat tours including sunset cruises, whale watching, and island hopping adventures. Our most popular tour is the 3-hour sunset cruise which departs daily at 4:30 PM.",
    },
    {
      id: 2,
      question: "What is your cancellation policy?",
      answer:
        "You can cancel up to 24 hours before your scheduled tour for a full refund. Cancellations within 24 hours are eligible for a 50% refund or the option to reschedule for a later date.",
    },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>Add frequently asked questions and their answers to train the AI system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label>Question</Label>
                    <Input value={item.question} onChange={() => {}} />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea value={item.answer} onChange={() => {}} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

