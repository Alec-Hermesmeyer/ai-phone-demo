"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns"
import type { Database } from "@/lib/supabase/types"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card } from "../../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../../components/ui/chart"

type TimeRange = "7d" | "14d" | "30d"

export function Overview() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d")
  const [data, setData] = useState<{ date: string; total: number }[]>([])
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchData = async () => {
      const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30
      const startDate = startOfDay(subDays(new Date(), days))

      // Get all calls within the date range
      const { data: calls } = await supabase
        .from("calls")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true })

      // Create an array of all dates in the range
      const dateRange = eachDayOfInterval({
        start: startDate,
        end: new Date(),
      })

      // Initialize data with 0 calls for each date
      const initialData = dateRange.map((date) => ({
        date: format(date, "MMM dd"),
        total: 0,
      }))

      // Count calls for each date
      calls?.forEach((call) => {
        const callDate = format(new Date(call.created_at), "MMM dd")
        const dataPoint = initialData.find((d) => d.date === callDate)
        if (dataPoint) {
          dataPoint.total++
        }
      })

      setData(initialData)
    }

    fetchData()

    // Set up real-time subscription
    const channel = supabase
      .channel("calls")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "calls",
        },
        () => {
          // Refresh data when new call is received
          fetchData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [timeRange, supabase])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChartContainer
        config={{
          total: {
            label: "Total Calls",
            color: "hsl(var(--primary))",
          },
        }}
        className="aspect-[4/3]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="total" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Average Calls/Day</div>
          <div className="text-2xl font-bold">
            {(data.reduce((acc, curr) => acc + curr.total, 0) / data.length).toFixed(1)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Peak Calls</div>
          <div className="text-2xl font-bold">{Math.max(...data.map((d) => d.total))}</div>
        </Card>
      </div>
    </div>
  )
}

