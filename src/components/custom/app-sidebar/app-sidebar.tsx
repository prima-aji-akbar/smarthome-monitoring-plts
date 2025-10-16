"use client"

import { Logs, LogOut, LayoutDashboard, Moon, Sun } from "lucide-react"
import Link from "next/link"
import Image from "next/image";
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import logoSidebar from "@/components/icons/logo-sidebar.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

const items = [
  {
    title: "Dashboard",
    url: "/views/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Event Log",
    url: "/views/event-log",
    icon: Logs,
  },
  {
    title: "Logout",
    url: "/views/logout",
    icon: LogOut,
  },
]

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Sidebar className="shadow-xl">
      <SidebarHeader>
        <SidebarGroupLabel>
          <div className="flex gap-2">
            <Image 
                src={logoSidebar} 
                alt="ATS Logo" 
                width={32}
                height={32}
                className="object-contain"
            />
            <h1 className="font-extrabold">ATS Monitoring System</h1>
          </div>
        </SidebarGroupLabel>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    <Separator />
      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {mounted && (theme === "dark" ? <Moon size={16} /> : <Sun size={16} />)}
            <span className="text-sm">
              {mounted ? (theme === "dark" ? "Dark" : "Light") : "Theme"}
            </span>
          </div>
          <Switch 
            checked={mounted && theme === "dark"} 
            onCheckedChange={toggleTheme}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}