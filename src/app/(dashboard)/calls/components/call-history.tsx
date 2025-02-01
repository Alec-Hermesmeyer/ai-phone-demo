"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Bot, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { ScrollArea } from "../../../../components/ui/scroll-area"
import { useToast } from "../../../../components/ui/use-toast"

interface Call {
  id: string
  from: string
  status: string
  aiHandled: boolean
  duration: number
  createdAt: string
}

export function CallHistory() {
  const [calls, setCalls] = useState<Call[]>([])
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .in("status", ["completed", "failed"])
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        toast({
          title: "Error fetching call history",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setCalls(data || [])
    }

    fetchCalls()

    // Subscribe to new completed calls
    const channel = supabase
      .channel("calls")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "calls",
          filter: `status=in.(completed,failed)`,
        },
        (payload) => {
          setCalls((current) => [payload.new as Call, ...current.slice(0, 9)])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Calls</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
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
                    <p className="text-sm text-muted-foreground">{format(new Date(call.createdAt), "MMM d, HH:mm")}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm">
                      {Math.round(call.duration / 60)}:{String(call.duration % 60).padStart(2, "0")}
                    </p>
                  </div>
                  <Badge variant={call.status === "completed" ? "default" : "destructive"}>{call.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

