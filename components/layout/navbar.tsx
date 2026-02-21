'use client'

import { Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from '@/lib/supabase/client'
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const pathname = usePathname()
  const supabase = createClient()

  // Fetch the user's email for the profile dropdown
  useEffect(() => {
    setIsMounted(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setEmail(user.email)
    }
    getUser()
  }, [supabase])

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!isMounted) return null

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50">
      
{/* LEFT SIDE: Mobile Menu & Logo */}
      <div className="flex items-center md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6 dark:text-white" />
            </Button>
          </SheetTrigger>
          {/* UPDATED: Dynamic background for mobile sheet */}
          <SheetContent side="left" className="p-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <div className="ml-4 font-bold text-lg flex items-center text-slate-900 dark:text-white">
          <span>ExamPrep</span>
          <span className="text-blue-600 dark:text-blue-500 ml-1">Command</span>
        </div>
      </div>

      {/* Spacer to push everything else to the right */}
      <div className="hidden md:flex flex-1"></div>

      {/* RIGHT SIDE: Theme Toggle & Profile Dropdown */}
      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2">
              <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {email ? email.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer w-full flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}