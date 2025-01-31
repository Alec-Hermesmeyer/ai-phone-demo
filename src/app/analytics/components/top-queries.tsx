import { Card, CardContent } from "../../../components/ui/card"

const queries = [
  {
    query: "Business hours",
    count: 245,
    percentage: 18,
  },
  {
    query: "Pricing information",
    count: 189,
    percentage: 14,
  },
  {
    query: "Booking process",
    count: 156,
    percentage: 12,
  },
  {
    query: "Cancellation policy",
    count: 124,
    percentage: 9,
  },
  {
    query: "Location directions",
    count: 98,
    percentage: 7,
  },
]

export function TopQueries() {
  return (
    <div className="space-y-4">
      {queries.map((item) => (
        <Card key={item.query}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.query}</p>
                <p className="text-sm text-muted-foreground">{item.count} calls</p>
              </div>
              <div className="text-sm font-medium">{item.percentage}%</div>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

