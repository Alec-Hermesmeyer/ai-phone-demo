"use client"

import { useState, useEffect } from "react"
import { Play, Loader2, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { useToast } from "./ui/use-toast"
import { AudioPlayer } from "./audio-player"

interface Voice {
  voice_id: string
  name: string
  preview_url?: string
}

const ELEVEN_LABS_VOICES: Voice[] = [
  {
    voice_id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    preview_url: "https://api.elevenlabs.io/v1/voices/21m00Tcm4TlvDq8ikWAM/preview",
  },
  {
    voice_id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    preview_url: "https://api.elevenlabs.io/v1/voices/AZnzlk1XvdvUeBnXmlld/preview",
  },
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    preview_url: "https://api.elevenlabs.io/v1/voices/EXAVITQu4vr4xnSDxMaL/preview",
  },
  {
    voice_id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    preview_url: "https://api.elevenlabs.io/v1/voices/ErXwobaYiN019PkySvjV/preview",
  },
  {
    voice_id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    preview_url: "https://api.elevenlabs.io/v1/voices/MF3mGyEYCl7XYWbV9V6O/preview",
  },
  {
    voice_id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    preview_url: "https://api.elevenlabs.io/v1/voices/TxGEqnHWrfWFTfGW9XjX/preview",
  },
  {
    voice_id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold",
    preview_url: "https://api.elevenlabs.io/v1/voices/VR6AewLTigWG4xSOukaG/preview",
  },
  {
    voice_id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    preview_url: "https://api.elevenlabs.io/v1/voices/pNInz6obpgDQGcFmaJgB/preview",
  },
  {
    voice_id: "yoZ06aMxZJJ28mfd3POQ",
    name: "Sam",
    preview_url: "https://api.elevenlabs.io/v1/voices/yoZ06aMxZJJ28mfd3POQ/preview",
  },
  {
    voice_id: "ThT5KcBeYPX3keUQqHPh",
    name: "Dorothy",
    preview_url: "https://api.elevenlabs.io/v1/voices/ThT5KcBeYPX3keUQqHPh/preview",
  },
  {
    voice_id: "ZQe5CZNOzWyzPSCn5a3c",
    name: "Grace",
    preview_url: "https://api.elevenlabs.io/v1/voices/ZQe5CZNOzWyzPSCn5a3c/preview",
  },
]

const EXAMPLE_TEXTS = [
  "Welcome aboard! I'm excited to be your tour guide today.",
  "Thank you for your inquiry. Our business hours are from 9 AM to 5 PM, Monday through Friday.",
  "I understand your concern, and I'll be happy to help you with that.",
  "That's a great question! Let me provide you with all the details.",
]

export function TextToSpeechDemo() {
  const [text, setText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<string>(ELEVEN_LABS_VOICES[0].voice_id)
  const [stability, setStability] = useState([0.75])
  const [similarity, setSimilarity] = useState([0.75])
  const [audioUrl, setAudioUrl] = useState<string>("")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    const voice = ELEVEN_LABS_VOICES.find((v) => v.voice_id === selectedVoice)
    setPreviewUrl(voice?.preview_url || "")
  }, [selectedVoice])

  const handleTextToSpeech = async () => {
    if (!text) return

    try {
      setIsGenerating(true)
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice_id: selectedVoice,
          stability: stability[0],
          similarity_boost: similarity[0],
        }),
      })

      if (!response.ok) throw new Error("Failed to convert text to speech")

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert text to speech. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setText(example)
    setAudioUrl("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
        <CardDescription>Convert text to lifelike speech using ElevenLabs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Text</Label>
          <Textarea
            placeholder="Enter text to convert to speech..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Voice Selection</Label>
              {previewUrl && (
                <Button variant="outline" size="sm" onClick={() => setAudioUrl(previewUrl)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Preview Voice
                </Button>
              )}
            </div>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {ELEVEN_LABS_VOICES.map((voice) => (
                  <SelectItem key={voice.voice_id} value={voice.voice_id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Stability ({stability[0]})</Label>
            <Slider
              value={stability}
              onValueChange={setStability}
              min={0}
              max={1}
              step={0.05}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>

          <div className="space-y-2">
            <Label>Similarity Boost ({similarity[0]})</Label>
            <Slider
              value={similarity}
              onValueChange={setSimilarity}
              min={0}
              max={1}
              step={0.05}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
          </div>

          <Button className="w-full" onClick={handleTextToSpeech} disabled={!text || isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Generate Speech
              </>
            )}
          </Button>

          {audioUrl && <AudioPlayer src={audioUrl} onEnded={() => setIsGenerating(false)} className="pt-4" />}
        </div>

        <div className="space-y-2">
          <Label>Example Texts</Label>
          <div className="grid gap-2">
            {EXAMPLE_TEXTS.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto whitespace-normal"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

