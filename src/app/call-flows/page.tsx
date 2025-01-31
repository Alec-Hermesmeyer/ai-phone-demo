"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export default function CallFlowsPage() {
  const [steps, setSteps] = useState([
    {
      id: 1,
      type: "greeting",
      content: "Welcome to our service! How can I help you today?",
    },
    {
      id: 2,
      type: "decision",
      condition: "intent_confidence < 0.7",
      action: "transfer_to_human",
    },
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Flow Configuration</CardTitle>
          <CardDescription>Design your automated call handling workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card key={step.id}>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-1">
                        <Label>Step Type</Label>
                        <Select defaultValue={step.type}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="greeting">Greeting</SelectItem>
                            <SelectItem value="decision">Decision</SelectItem>
                            <SelectItem value="response">Response</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Label>Content/Condition</Label>
                        <Input
                          defaultValue={step.content || step.condition}
                          placeholder={step.type === "decision" ? "Enter condition" : "Enter content"}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="w-full">Add Step</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

