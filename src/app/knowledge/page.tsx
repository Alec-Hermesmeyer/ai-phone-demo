"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Plus, Upload, Download } from "lucide-react"

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
          <CardDescription>Manage your AI system's knowledge and responses</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="faqs">
            <TabsList>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="responses">Custom Responses</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="faqs" className="space-y-4">
              <div className="flex justify-between">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import FAQs
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export FAQs
                </Button>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <Input placeholder="Enter frequently asked question" />
                    </div>
                    <div>
                      <Label>Answer</Label>
                      <Textarea placeholder="Enter the answer" />
                    </div>
                    <div>
                      <Label>Categories</Label>
                      <Input placeholder="Add categories (comma-separated)" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

