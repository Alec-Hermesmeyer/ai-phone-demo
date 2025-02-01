"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Phone, User, Bot, MoreVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Badge } from "../../../../components/ui/badge"
import { ScrollArea } from "../../../../components/ui/scroll-area"
import { useToast } from "../../../../components/ui/use-toast"

interface Call {
  id: string
  callSid: string
  from: string
  to: string
  status: string
  aiHandled: boolean
  duration: number | null
  createdAt: string
}

export function ActiveCalls() {
  const [calls, setCalls] = useState<Call[]>([])
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch initial active calls
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .in("status", ["in-progress", "ringing"])
        .order("created_at", { ascending: false })

      if (error) {
        toast({
          title: "Error fetching calls",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setCalls(data || [])
    }

    fetchCalls()

    // Subscribe to call updates
    const channel = supabase
      .channel("calls")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calls",
        },
        (payload) => {
          if (payload.eventType === "INSERT" && ["in-progress", "ringing"].includes(payload.new.status)) {
            setCalls((current) => [payload.new as Call, ...current])
          } else if (payload.eventType === "UPDATE") {
            setCalls((current) => {
              if (!["in-progress", "ringing"].includes(payload.new.status)) {
                return current.filter((call) => call.id !== payload.new.id)
              }
              return current.map((call) => (call.id === payload.new.id ? (payload.new as Call) : call))
            })
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, toast])

  const handleTransfer = async (callSid: string) => {
    try {
      const response = await fetch("/api/calls/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callSid }),
      })

      if (!response.ok) throw new Error("Failed to transfer call")

      toast({
        title: "Call transferred",
        description: "The call has been transferred to an agent.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer call. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Calls</CardTitle>
        <Badge variant="secondary">{calls.length} Active</Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {calls.map((call) => (
              <div key={call.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                <div className="flex items-center space-x-4">
                  {call.aiHandled ? (
                    <Bot className="h-8 w-8 p-1.5 rounded-full bg-primary/10" />
                  ) : (
                    <User className="h-8 w-8 p-1.5 rounded-full bg-muted" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{call.from}</p>
                    <p className="text-sm text-muted-foreground">
                      Started {format(new Date(call.createdAt), "HH:mm:ss")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={call.status === "in-progress" ? "default" : "secondary"}>{call.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleTransfer(call.callSid)}>
                        Transfer to Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/calls/${call.id}`, "_blank")}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            {calls.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Phone className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No active calls</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

