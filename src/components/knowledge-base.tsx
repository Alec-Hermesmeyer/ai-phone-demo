"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { useToast } from "../components/ui/use-toast"
import { addDocument, deleteDocument } from "@/lib/api"

interface KnowledgeItem {
  id: string
  question: string
  answer: string
  isNew?: boolean
}

export function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load initial items
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true)
      try {
        // In a real app, you'd fetch existing items here
        setItems([
          {
            id: "1",
            question: "What tours do you offer?",
            answer:
              "We offer several boat tours including sunset cruises, whale watching, and island hopping adventures. Our most popular tour is the 3-hour sunset cruise which departs daily at 4:30 PM.",
          },
          {
            id: "2",
            question: "What is your cancellation policy?",
            answer:
              "You can cancel up to 24 hours before your scheduled tour for a full refund. Cancellations within 24 hours are eligible for a 50% refund or the option to reschedule for a later date.",
          },
        ])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load knowledge base items.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadItems()
  }, [toast])

  const handleAddItem = async () => {
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      question: "",
      answer: "",
      isNew: true,
    }

    setItems((current) => [...current, newItem])
  }

  const handleDeleteItem = async (id: string) => {
    try {
      setIsLoading(true)
      await deleteDocument(id)
      setItems((current) => current.filter((item) => item.id !== id))
      toast({
        title: "Item deleted",
        description: "Knowledge base item has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateItem = async (id: string, field: keyof KnowledgeItem, value: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )

    const item = items.find((i) => i.id === id)
    if (!item) return

    // If this is a new item and both fields are filled, save it
    if (item.isNew && item.question && item.answer) {
      try {
        setIsLoading(true)
        const savedDoc = await addDocument(item.answer, {
          type: "faq",
          question: item.question,
        })

        // Update the item with the real ID and remove isNew flag
        setItems((current) =>
          current.map((i) =>
            i.id === id
              ? {
                  ...i,
                  id: savedDoc.id,
                  isNew: false,
                }
              : i,
          ),
        )

        toast({
          title: "Item saved",
          description: "New knowledge base item has been added.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save item. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

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
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Question</Label>
                      <Input
                        value={item.question}
                        onChange={(e) => handleUpdateItem(item.id, "question", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea
                      value={item.answer}
                      onChange={(e) => handleUpdateItem(item.id, "answer", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button className="w-full" onClick={handleAddItem} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add New Item
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

