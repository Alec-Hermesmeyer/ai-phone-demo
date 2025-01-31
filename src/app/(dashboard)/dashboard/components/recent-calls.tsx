"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "../../../../components/ui/badge"
import { ScrollArea } from "../../../../components/ui/scroll-area"
import type { Database } from "@/lib/supabase/types"

type Call = Database["public"]["Tables"]["calls"]["Row"]

export function RecentCalls() {
  const [calls, setCalls] = useState<Call[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    // Fetch initial calls
    const fetchCalls = async () => {
      const { data } = await supabase.from("calls").select("*").order("created_at", { ascending: false }).limit(10)

      if (data) {
        setCalls(data)
      }
    }

    fetchCalls()

    // Subscribe to new calls
    const channel = supabase
      .channel("calls")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "calls",
        },
        (payload) => {
          setCalls((current) => {
            const newCall = payload.new as Call
            return [newCall, ...current].slice(0, 10)
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {calls.map((call) => (
          <div key={call.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">{call.from_number}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(call.created_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm">{call.duration ? `${Math.round(call.duration / 1000)}s` : "In progress"}</p>
              </div>
              <Badge variant={call.ai_handled ? "default" : "secondary"}>
                {call.ai_handled ? "AI Handled" : "Transferred"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

