"use client"

import { Home, Phone, Settings, Users, BarChart, BookText, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Call Flows",
    icon: Phone,
    href: "/call-flows",
  },
  {
    label: "Knowledge Base",
    icon: BookText,
    href: "/knowledge",
  },
  {
    label: "Team",
    icon: Users,
    href: "/team",
  },
  {
    label: "Analytics",
    icon: BarChart,
    href: "/analytics",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 border-r bg-card">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Headphones className="h-6 w-6" />
          <span className="font-bold">AI Phone System</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1 p-2">
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", {
                "bg-muted": pathname === route.href,
              })}
            >
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

