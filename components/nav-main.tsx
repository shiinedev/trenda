"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {


  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} >
              <SidebarMenuButton tooltip={item.title} asChild className={`${item.url === pathname ? "bg-sidebar-primary text-sidebar-primary-foreground rounded hover:bg-sidebar-primary/80 hover:text-sidebar-primary-foreground" :""}`} >
                <Link href={`${item.url}`} >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
