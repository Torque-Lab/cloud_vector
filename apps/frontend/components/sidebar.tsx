"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Box, Columns3, Gem, Vibrate } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
  },
  {
    title:"Postgres",
    href:"/postgres",
    icon:(
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
      
    )
  },
  {
    title:"RabbitMQ",
    href:"/rabbitmq",
    icon:(
      <Columns3 />
    )
  },
  {
    title:"Redis",
    href:"/redis",
    icon:(
     <Box/>
    )
  },
  {
    title: "VectorDB",
    href: "/databases",
    icon: (
      <Vibrate />
    ),
  },  {
    title: "Projects",
    href: "/projects",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    title: "API Keys",
    href: "/api-keys",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
  },
  {
    title: "IAM",
    href: "/iam",
    icon: (
      <Gem />
    ),
  },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-card border-r h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out flex flex-col fixed left-0 top-16 z-10",
        isOpen ? "w-56" : "w-14"
      )}
    >
      <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 p-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg p-2 text-sm font-medium transition-colors w-full justify-center md:justify-start",
              isOpen && "md:space-x-3",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            title={!isOpen ? item.title : undefined}
          >
            {item.icon}
            {isOpen && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button
          onClick={onToggle}
          className={cn(
            "p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors",
            isOpen ? "w-full flex items-center justify-center space-x-2" : "w-full flex justify-center",
          )}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
          {isOpen && <span className="text-sm">Collapse</span>}
        </Button>
      </div>

      <div className="border-t p-4 flex-shrink-0">
        <div className={cn("flex items-center", isOpen ? "space-x-3" : "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
