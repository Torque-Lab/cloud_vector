import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import TokenRefresher from "@/provider/token-refreshor"

export const metadata: Metadata = {
  title: "Vector Cloud - Managed Cloud Service",
  description: "Seamless, Scalable, and Reliable Cloud Solutions for Modern Applications",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-y-scroll">
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body className={cn(
        "min-h-screen w-full overflow-x-hidden",
        "bg-background font-sans antialiased",
        "scrollbar-gutter-stable"
      )} style={{ scrollbarGutter: 'stable' }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          <TokenRefresher />
        </ThemeProvider>
      </body>
    </html>
  )
}
