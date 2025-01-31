"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/types"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type CallData = {
  hour: number
  calls: number
  aiHandled: number
}

export function CallStats() {
  const [data, setData] = useState<CallData[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const { data: calls } = await supabase
        .from("calls")
        .select("created_at, ai_handled")
        .gte("created_at", twentyFourHoursAgo.toISOString())

      if (calls) {
        // Process data by hour
        const hourlyData: Record<number, { calls: number; aiHandled: number }> = {}

        calls.forEach((call) => {
          const hour = new Date(call.created_at).getHours()
          if (!hourlyData[hour]) {
            hourlyData[hour] = { calls: 0, aiHandled: 0 }
          }
          hourlyData[hour].calls++
          if (call.ai_handled) {
            hourlyData[hour].aiHandled++
          }
        })

        // Convert to array format for chart
        const chartData: CallData[] = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          calls: hourlyData[i]?.calls || 0,
          aiHandled: hourlyData[i]?.aiHandled || 0,
        }))

        setData(chartData)
      }
    }

    fetchData()
  }, [supabase])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="hour" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Calls" />
        <Bar dataKey="aiHandled" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.5} name="AI Handled" />
      </BarChart>
    </ResponsiveContainer>
  )
}

