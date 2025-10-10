"use client"
import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useClientSession } from "@/provider/client-session"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {user}=useClientSession() 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onCreateProject={() => {}} />
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} user={user}/>
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarOpen ? "md:pl-56" : "md:pl-14"
          }`}
          style={{ minHeight: 'calc(100vh - 4rem)' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
