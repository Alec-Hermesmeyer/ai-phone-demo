"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { useToast } from "../../../../components/ui/use-toast"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CallMetrics {
  hour: number
  total: number
  aiHandled: number
}

export function CallStats() {
  const [metrics, setMetrics] = useState<CallMetrics[]>([])
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMetrics = async () => {
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from("calls")
        .select("created_at, ai_handled")
        .gte("created_at", twentyFourHoursAgo.toISOString())

      if (error) {
        toast({
          title: "Error fetching metrics",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Process data by hour
      const hourlyData: Record<number, { total: number; aiHandled: number }> = {}

      data?.forEach((call) => {
        const hour = new Date(call.created_at).getHours()
        if (!hourlyData[hour]) {
          hourlyData[hour] = { total: 0, aiHandled: 0 }
        }
        hourlyData[hour].total++
        if (call.ai_handled) {
          hourlyData[hour].aiHandled++
        }
      })

      // Convert to array format for chart
      const chartData: CallMetrics[] = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        total: hourlyData[i]?.total || 0,
        aiHandled: hourlyData[i]?.aiHandled || 0,
      }))

      setMetrics(chartData)
    }

    fetchMetrics()

    // Refresh metrics every minute
    const interval = setInterval(fetchMetrics, 60000)

    return () => clearInterval(interval)
  }, [supabase, toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Volume (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metrics}>
            <XAxis
              dataKey="hour"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Calls" />
            <Bar dataKey="aiHandled" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.5} name="AI Handled" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

