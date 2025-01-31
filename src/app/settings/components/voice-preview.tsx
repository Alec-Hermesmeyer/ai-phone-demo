"use client"

import { Card, CardContent } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"

interface VoicePreviewProps {
  settings?: {
    voiceType?: string
    speakingRate?: number
    pitch?: number
  }
}

export function VoicePreview({ settings }: VoicePreviewProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label>Current Voice Settings</Label>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>{" "}
              {settings?.voiceType ?? "N/A"}
            </div>
            <div>
              <span className="text-muted-foreground">Rate:</span>{" "}
              {settings?.speakingRate !== undefined
                ? settings.speakingRate.toFixed(1)
                : "N/A"}
            </div>
            <div>
              <span className="text-muted-foreground">Pitch:</span>{" "}
              {settings?.pitch !== undefined
                ? `${settings.pitch > 0 ? "+" : ""}${settings.pitch}`
                : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
