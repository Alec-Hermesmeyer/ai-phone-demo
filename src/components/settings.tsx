"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Switch } from "./ui/switch"

export function Settings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure how the AI phone system handles calls and transfers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Business Hours</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input type="time" placeholder="Start Time" defaultValue="09:00" />
              <Input type="time" placeholder="End Time" defaultValue="17:00" />
            </div>
          </div>
          <div>
            <Label>Transfer Phone Number</Label>
            <Input type="tel" placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Call Handling</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-transfer on uncertainty</Label>
              <p className="text-sm text-muted-foreground">
                Automatically transfer to human operator if AI is uncertain
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Call recording</Label>
              <p className="text-sm text-muted-foreground">Record calls for quality assurance</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

