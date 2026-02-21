import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Dynamic background that changes based on theme
    <div className="h-full relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Desktop Sidebar - Background color is now handled inside the Sidebar component */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="md:pl-72 w-full pb-10">
        <Navbar />
        <div className="animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-4 ease-out">
          {children}
        </div>
      </main>
    </div>
  )
}