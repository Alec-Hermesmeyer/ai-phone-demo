import { Store, Ship, Hospital, Hotel, Briefcase, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

const templates = [
  {
    icon: Ship,
    title: "Tourism & Travel",
    description: "Tour bookings, schedules, and travel information",
  },
  {
    icon: Store,
    title: "Retail",
    description: "Product inquiries, orders, and customer service",
  },
  {
    icon: Hospital,
    title: "Healthcare",
    description: "Appointment scheduling and general inquiries",
  },
  {
    icon: Hotel,
    title: "Hospitality",
    description: "Reservations, amenities, and guest services",
  },
  {
    icon: Briefcase,
    title: "Professional Services",
    description: "Consultations, appointments, and client support",
  },
  {
    icon: Building2,
    title: "Real Estate",
    description: "Property information, viewings, and agent connection",
  },
]

export function Templates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Templates</CardTitle>
        <CardDescription>Quick-start templates for common business types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.title}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <template.icon className="h-8 w-8 mb-2" />
                  <h3 className="font-medium">{template.title}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <Button variant="outline" className="mt-4">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

