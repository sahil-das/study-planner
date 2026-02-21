'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Timer, Target, ListTodo } from 'lucide-react'

const routes = [
  { 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: '/dashboard', 
    color: 'text-sky-500' 
  },
  { 
    label: 'Syllabus', 
    icon: BookOpen, 
    href: '/dashboard/syllabus', 
    color: 'text-violet-500' 
  },
  { 
    label: 'Study Timer', 
    icon: Timer, 
    href: '/dashboard/timer', 
    color: 'text-orange-500' 
  },
  { 
    label: 'Mock Tests', 
    icon: Target, 
    href: '/dashboard/mock-tests', 
    color: 'text-pink-600' 
  },
  { 
    label: 'Master Planner', 
    icon: ListTodo, 
    href: '/dashboard/tasks', 
    color: 'text-emerald-500' 
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    // Dynamic background: White in light mode, Dark Slate in dark mode
    <div className="space-y-4 py-4 flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="px-3 py-2 flex-1">
        
        {/* Logo Section */}
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            ExamPrep <span className="text-blue-600 dark:text-blue-500 text-xs align-top block -mt-1">Command</span>
          </h1>
        </Link>
        
        {/* Navigation Links */}
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                  {route.label}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}