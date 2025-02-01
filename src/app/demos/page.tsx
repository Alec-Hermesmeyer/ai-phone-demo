import { VoiceDemos } from "../../components/voice-demos"

export default function DemosPage() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Voice Demos</h1>
        <p className="text-muted-foreground">
          Explore our speech-to-text and text-to-speech capabilities powered by OpenAI Whisper and ElevenLabs.
        </p>
      </div>
      <VoiceDemos />
    </div>
  )
}

