"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "2024-01-01", rate: 12 },
  { date: "2024-01-02", rate: 15 },
  { date: "2024-01-03", rate: 11 },
  { date: "2024-01-04", rate: 13 },
  { date: "2024-01-05", rate: 14 },
  { date: "2024-01-06", rate: 10 },
  { date: "2024-01-07", rate: 9 },
  { date: "2024-01-08", rate: 12 },
  { date: "2024-01-09", rate: 13 },
  { date: "2024-01-10", rate: 11 },
]

export function HandoffRate() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

