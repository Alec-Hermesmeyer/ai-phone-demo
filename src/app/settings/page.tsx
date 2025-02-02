"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, TestTube2, Wand2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useToast } from "../../components/ui/use-toast"
import { Slider } from "../../components/ui/slider"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { VoicePreview } from "./components/voice-preview"
import { IntegrationCard } from "./components/integration-card"

const formSchema = z.object({
  // General Settings
  companyName: z.string().min(2),
  timezone: z.string(),
  businessHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
  language: z.string(),

  // Voice & Tone
  voiceType: z.string(),
  greeting: z.string(),
  speakingRate: z.number().min(0.5).max(2),
  pitch: z.number().min(-10).max(10),
  customPrompt: z.string(),

  // Notifications
  notificationEmail: z.string().email().optional(),
  missedCallAlerts: z.boolean(),
  voicemailAlerts: z.boolean(),
  weeklyReports: z.boolean(),
  dailyDigest: z.boolean(),

  // Advanced
  confidenceThreshold: z.number(),
  maxRetries: z.number().min(1).max(5),
  recordCalls: z.boolean(),
  autoTranscribe: z.boolean(),
  fallbackNumber: z.string().optional(),

  // Integrations
  crm: z.object({
    enabled: z.boolean(),
    provider: z.string().optional(),
    apiKey: z.string().optional(),
  }),
  ticketing: z.object({
    enabled: z.boolean(),
    provider: z.string().optional(),
    apiKey: z.string().optional(),
  }),
})

type FormData = z.infer<typeof formSchema>

const availableIntegrations = [
  {
    id: "crm",
    name: "CRM Integration",
    description: "Connect with your Customer Relationship Management system",
    providers: ["Salesforce", "HubSpot", "Zoho"],
  },
  {
    id: "ticketing",
    name: "Ticketing System",
    description: "Integrate with your help desk software",
    providers: ["Zendesk", "Freshdesk", "ServiceNow"],
  },
]

export default function SettingsPage() {
  const { toast } = useToast()
  const [isTestingVoice, setIsTestingVoice] = useState(false)
  const supabase = createClientComponentClient()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      speakingRate: 1,
      pitch: 0,
      confidenceThreshold: 0.7,
      maxRetries: 3,
    },
  })

  const {
    formState: { isSubmitting },
    watch,
  } = form

  const voiceSettings = {
    voiceType: watch("voiceType"),
    speakingRate: watch("speakingRate"),
    pitch: watch("pitch"),
  };
  
 
  
  useEffect(() => {
    // Fetch current settings
    const fetchSettings = async () => {
      const { data: settings, error } = await supabase.from("settings").select("*").single()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
        return
      }

      if (settings) {
        form.reset(settings)
      }
    }

    fetchSettings()
  }, [form, supabase, toast])

  async function onSubmit(data: FormData) {
    try {
      const { error } = await supabase.from("settings").upsert(data)

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleTestVoice() {
    setIsTestingVoice(true)
    try {
      const response = await fetch("/api/test-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voiceSettings),
      })

      if (!response.ok) throw new Error("Failed to test voice")

      toast({
        title: "Test call initiated",
        description: "You should receive a test call shortly.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate test call. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTestingVoice(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your AI phone system settings</p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="voice">Voice & Tone</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" {...form.register("companyName")} />
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select value={form.watch("timezone")} onValueChange={(value) => form.setValue("timezone", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Business Hours Start</Label>
                  <Input type="time" {...form.register("businessHours.start")} />
                </div>
                <div className="space-y-2">
                  <Label>Business Hours End</Label>
                  <Input type="time" {...form.register("businessHours.end")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice & Tone Settings</CardTitle>
              <CardDescription>Customize how your AI assistant communicates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Voice Type</Label>
                <Select value={form.watch("voiceType")} onValueChange={(value) => form.setValue("voiceType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Speaking Rate</Label>
                <Slider
                  value={[form.watch("speakingRate")]}
                  onValueChange={([value]) => form.setValue("speakingRate", value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pitch</Label>
                <Slider
                  value={[form.watch("pitch")]}
                  onValueChange={([value]) => form.setValue("pitch", value)}
                  min={-10}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lower</span>
                  <span>Higher</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Greeting</Label>
                <Textarea {...form.register("greeting")} placeholder="Enter your default greeting message" />
              </div>
              <div className="flex items-center space-x-2">
                <Button type="button" variant="outline" onClick={handleTestVoice} disabled={isTestingVoice}>
                  {isTestingVoice ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TestTube2 className="mr-2 h-4 w-4" />
                  )}
                  Test Voice Settings
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.setValue("voiceType", "professional")
                    form.setValue("speakingRate", 1)
                    form.setValue("pitch", 0)
                  }}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
              </div>
              <VoicePreview settings={voiceSettings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Notification Email</Label>
                <Input type="email" {...form.register("notificationEmail")} placeholder="Enter notification email" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="missedCalls">Missed Call Alerts</Label>
                  <Switch
                    id="missedCalls"
                    checked={form.watch("missedCallAlerts")}
                    onCheckedChange={(checked) => form.setValue("missedCallAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="voicemail">Voicemail Notifications</Label>
                  <Switch
                    id="voicemail"
                    checked={form.watch("voicemailAlerts")}
                    onCheckedChange={(checked) => form.setValue("voicemailAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <Switch
                    id="weeklyReports"
                    checked={form.watch("weeklyReports")}
                    onCheckedChange={(checked) => form.setValue("weeklyReports", checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="dailyDigest">Daily Digest</Label>
                  <Switch
                    id="dailyDigest"
                    checked={form.watch("dailyDigest")}
                    onCheckedChange={(checked) => form.setValue("dailyDigest", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>AI Confidence Threshold</Label>
                <Select
                  value={String(form.watch("confidenceThreshold"))}
                  onValueChange={(value) => form.setValue("confidenceThreshold", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.9">High (90%)</SelectItem>
                    <SelectItem value="0.7">Medium (70%)</SelectItem>
                    <SelectItem value="0.5">Low (50%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Maximum Retries</Label>
                <Select
                  value={String(form.watch("maxRetries"))}
                  onValueChange={(value) => form.setValue("maxRetries", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select max retries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 retry</SelectItem>
                    <SelectItem value="2">2 retries</SelectItem>
                    <SelectItem value="3">3 retries</SelectItem>
                    <SelectItem value="4">4 retries</SelectItem>
                    <SelectItem value="5">5 retries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Call Recording</Label>
                  <p className="text-sm text-muted-foreground">Record all calls for quality assurance</p>
                </div>
                <Switch
                  checked={form.watch("recordCalls")}
                  onCheckedChange={(checked) => form.setValue("recordCalls", checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label>Auto-Transcription</Label>
                  <p className="text-sm text-muted-foreground">Automatically transcribe all calls</p>
                </div>
                <Switch
                  checked={form.watch("autoTranscribe")}
                  onCheckedChange={(checked) => form.setValue("autoTranscribe", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fallback Phone Number</Label>
                <Input type="tel" {...form.register("fallbackNumber")} placeholder="+1 (555) 000-0000" />
                <p className="text-sm text-muted-foreground">Used when AI cannot handle the call</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid gap-4 md:grid-cols-2">
            {availableIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} formControl={form.control} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}

