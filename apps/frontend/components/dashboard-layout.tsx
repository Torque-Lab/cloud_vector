"use client"
import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onCreateProject={() => {}} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-0" : "ml-0"}`}>
          <div className="max-w-7xl mx-auto px-4 py-4">{children}</div>
        </main>
      </div>
    </div>
  )
}
