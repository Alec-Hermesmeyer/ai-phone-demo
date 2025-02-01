"use client"

import { useState } from "react"
import { Mic, NetworkIcon as VoiceNetwork } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { SpeechToTextDemo } from "./speech-to-text-demo"
import { TextToSpeechDemo } from "./text-to-speech-demo"

export function VoiceDemos() {
  const [activeTab, setActiveTab] = useState("speech-to-text")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Mic className="h-8 w-8 mb-2" />
              <h3 className="font-medium">Speech Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Powered by OpenAI Whisper for accurate speech-to-text conversion
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <VoiceNetwork className="h-8 w-8 mb-2" />
              <h3 className="font-medium">Voice Synthesis</h3>
              <p className="text-sm text-muted-foreground">Lifelike voices powered by ElevenLabs text-to-speech</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="speech-to-text">Speech to Text</TabsTrigger>
          <TabsTrigger value="text-to-speech">Text to Speech</TabsTrigger>
        </TabsList>
        <TabsContent value="speech-to-text">
          <SpeechToTextDemo />
        </TabsContent>
        <TabsContent value="text-to-speech">
          <TextToSpeechDemo />
        </TabsContent>
      </Tabs>
    </div>
  )
}

