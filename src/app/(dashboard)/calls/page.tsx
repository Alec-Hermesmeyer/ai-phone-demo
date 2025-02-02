// import { Suspense } from "react"
import { ActiveCalls } from "./components/active-calls"
import { CallHistory } from "./components/call-history"
import { CallStats } from "./components/call-stats"
// import { CallsLoading } from "./loading"

export default function CallsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Call Monitor</h1>
        <p className="text-muted-foreground">Monitor and manage active calls in real-time</p>
      </div>

      {/* <Suspense fallback={<CallsLoading />}> */}
        <div className="grid gap-6">
          <ActiveCalls />
          <div className="grid gap-6 md:grid-cols-2">
            <CallStats />
            <CallHistory />
          </div>
        </div>
      {/* </Suspense> */}
    </div>
  )
}

