import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Overview } from "./components/overview"
import { RecentCalls } from "./components/recent-calls"
import { CallStats } from "./components/call-stats"
import { unstable_noStore as noStore } from "next/cache"

async function getCallStats() {
  noStore()
  const supabase = createServerComponentClient({ cookies })

  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

  // Get total calls
  const { count: totalCalls } = await supabase
    .from("calls")
    .select("*", { count: "exact" })
    .gte("created_at", thirtyDaysAgo.toISOString())

  // Get AI handled calls
  const { count: aiHandledCalls } = await supabase
    .from("calls")
    .select("*", { count: "exact" })
    .eq("ai_handled", true)
    .gte("created_at", thirtyDaysAgo.toISOString())

  // Calculate average response time (using duration field as proxy)
  const { data: avgDurationData } = await supabase
    .from("calls")
    .select("duration")
    .not("duration", "is", null)
    .gte("created_at", thirtyDaysAgo.toISOString())

  const avgDuration = avgDurationData?.reduce((acc, curr) => acc + (curr.duration || 0), 0) || 0
  const avgResponseTime = avgDurationData?.length ? avgDuration / avgDurationData.length : 0

  return {
    totalCalls: totalCalls || 0,
    aiResolutionRate: totalCalls ? ((aiHandledCalls || 0) / totalCalls) * 100 : 0,
    avgResponseTime: avgResponseTime || 0,
  }
}

export default async function DashboardPage() {
  const stats = await getCallStats()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiResolutionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Of total calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.avgResponseTime / 1000).toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">Per interaction</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Call Volume Overview</CardTitle>
            <CardDescription>Call distribution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Latest customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentCalls />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Call Statistics</CardTitle>
            <CardDescription>Detailed metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <CallStats />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

