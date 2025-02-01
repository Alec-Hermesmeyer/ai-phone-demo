"use client"

import { useState } from "react"
import { Plus, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { useToast } from "../../components/ui/use-toast"
import { FileUpload } from "../../components/file-upload"
import { processPDF, processCSV, exportFAQs } from "@/lib/process-files"
import { addDocument } from "@/lib/api"

interface FAQ {
  question: string
  answer: string
  categories: string
}

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState("faqs")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newFAQ, setNewFAQ] = useState<FAQ>({
    question: "",
    answer: "",
    categories: "",
  })
  const { toast } = useToast()

  const handleSubmitFAQ = async () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast({
        title: "Error",
        description: "Please fill in both question and answer fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await addDocument(newFAQ.answer, {
        type: "faq",
        question: newFAQ.question,
        categories: newFAQ.categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      })

      toast({
        title: "FAQ Added",
        description: "Your FAQ has been added to the knowledge base.",
      })

      setNewFAQ({
        question: "",
        answer: "",
        categories: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add FAQ. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>Manage your AI system's knowledge and responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="faqs" className="space-y-4">
              <div className="flex justify-between">
                <FileUpload
                  accept={{
                    "text/csv": [".csv"],
                    "application/json": [".json"],
                  }}
                  onUpload={processCSV}
                />
                <Button variant="outline" onClick={() => exportFAQs([])}>
                  <Download className="mr-2 h-4 w-4" />
                  Export FAQs
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        placeholder="Enter frequently asked question"
                        value={newFAQ.question}
                        onChange={(e) => setNewFAQ((prev) => ({ ...prev, question: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea
                        id="answer"
                        placeholder="Enter the answer"
                        value={newFAQ.answer}
                        onChange={(e) => setNewFAQ((prev) => ({ ...prev, answer: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="categories">Categories</Label>
                      <Input
                        id="categories"
                        placeholder="Add categories (comma-separated)"
                        value={newFAQ.categories}
                        onChange={(e) => setNewFAQ((prev) => ({ ...prev, categories: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={handleSubmitFAQ} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add FAQ
              </Button>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <FileUpload
                accept={{
                  "application/pdf": [".pdf"],
                }}
                maxSize={10485760} // 10MB
                onUpload={processPDF}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

