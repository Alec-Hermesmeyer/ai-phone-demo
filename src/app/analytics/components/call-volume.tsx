"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "2024-01-01", calls: 145 },
  { date: "2024-01-02", calls: 168 },
  { date: "2024-01-03", calls: 156 },
  { date: "2024-01-04", calls: 187 },
  { date: "2024-01-05", calls: 192 },
  { date: "2024-01-06", calls: 85 },
  { date: "2024-01-07", calls: 63 },
  { date: "2024-01-08", calls: 148 },
  { date: "2024-01-09", calls: 164 },
  { date: "2024-01-10", calls: 176 },
]

export function CallVolume() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="calls" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

