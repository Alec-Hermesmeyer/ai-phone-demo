"use client"

import { useState } from "react"
import { Bot, Phone, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { KnowledgeBase } from "./knowledge-base"
import { CallSimulator } from "./call-simulater"
import { Settings } from "./settings"

export function PhoneConfig() {
  const [activeTab, setActiveTab] = useState("knowledge")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Boat Tour Company Phone System</CardTitle>
          <CardDescription>
            Configure your AI phone system to handle customer inquiries about tours, bookings, and policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Bot className="h-8 w-8 mb-2" />
                  <h3 className="font-medium">AI Responses</h3>
                  <p className="text-sm text-muted-foreground">Handles common inquiries automatically</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Phone className="h-8 w-8 mb-2" />
                  <h3 className="font-medium">Call Management</h3>
                  <p className="text-sm text-muted-foreground">Routes calls based on context</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <User className="h-8 w-8 mb-2" />
                  <h3 className="font-medium">Human Handoff</h3>
                  <p className="text-sm text-muted-foreground">Seamless transfer to staff when needed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Bot className="h-8 w-8 mb-2" />
                  <h3 className="font-medium">Voice Synthesis</h3>
                  <p className="text-sm text-muted-foreground">Natural-sounding AI voices</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="simulator">Call Simulator</TabsTrigger>
          <TabsTrigger value="speech">Speech Test</TabsTrigger>
        </TabsList>
        <TabsContent value="knowledge">
          <KnowledgeBase />
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
        <TabsContent value="simulator">
          <CallSimulator />
        </TabsContent>
        <TabsContent value="speech">
          <SpeechTest />
        </TabsContent>
      </Tabs>
    </div>
  )
}
