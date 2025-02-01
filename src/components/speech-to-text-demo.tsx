"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Loader2, Copy, Check } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { useToast } from "./ui/use-toast"
import { AudioVisualizer } from "./audio-visualizer"

const EXAMPLE_PHRASES = [
  "The quick brown fox jumps over the lazy dog.",
  "Hello, my name is Sarah and I'd like to book a tour.",
  "What are your business hours and location?",
  "Could you tell me about your refund policy?",
]

export function SpeechToTextDemo() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [stream, setStream] = useState<MediaStream>()
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [stream])

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(audioStream)
      mediaRecorder.current = new MediaRecorder(audioStream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" })
        await handleSpeechToText(audioBlob)
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop()
      stream?.getTracks().forEach((track) => track.stop())
      setStream(undefined)
      setIsRecording(false)
    }
  }

  const handleSpeechToText = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append("file", audioBlob)

    try {
      setIsProcessing(true)
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to convert speech to text")

      const data = await response.json()
      setTranscript(data.text)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert speech to text. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech to Text</CardTitle>
        <CardDescription>Convert speech to text using OpenAI Whisper</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          {isRecording && stream && <AudioVisualizer stream={stream} isRecording={isRecording} />}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Transcript</Label>
            {transcript && (
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={copyToClipboard}>
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
          <div className="relative rounded-md border p-4 min-h-[100px]">
            {isProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              transcript || "Record something..."
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Example Phrases</Label>
          <div className="grid gap-2">
            {EXAMPLE_PHRASES.map((phrase, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto whitespace-normal"
                onClick={() => setTranscript(phrase)}
              >
                {phrase}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

