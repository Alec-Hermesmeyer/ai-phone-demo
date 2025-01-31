import { Avatar } from "./ui/avatar"
import { Badge } from "./ui/badge"

const recentCalls = [
  {
    id: 1,
    caller: "John Smith",
    time: "2 minutes ago",
    duration: "4:23",
    status: "Resolved by AI",
    topic: "Product Inquiry",
  },
  {
    id: 2,
    caller: "Sarah Johnson",
    time: "15 minutes ago",
    duration: "2:45",
    status: "Transferred",
    topic: "Technical Support",
  },
  {
    id: 3,
    caller: "Michael Brown",
    time: "1 hour ago",
    duration: "5:12",
    status: "Resolved by AI",
    topic: "Booking",
  },
  {
    id: 4,
    caller: "Emily Davis",
    time: "2 hours ago",
    duration: "3:56",
    status: "Resolved by AI",
    topic: "General Inquiry",
  },
]

export function RecentCalls() {
  return (
    <div className="space-y-4">
      {recentCalls.map((call) => (
        <div key={call.id} className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <Avatar />
            <div>
              <p className="text-sm font-medium leading-none">{call.caller}</p>
              <p className="text-sm text-muted-foreground">{call.time}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium leading-none">{call.topic}</p>
              <p className="text-sm text-muted-foreground">{call.duration}</p>
            </div>
            <Badge variant={call.status === "Resolved by AI" ? "default" : "secondary"}>{call.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

