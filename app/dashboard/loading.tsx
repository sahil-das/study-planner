import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 md:w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Animated Spinner for extra feedback */}
      <div className="mt-12 flex justify-center items-center py-10 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 font-medium animate-pulse">Fetching your data...</span>
      </div>
    </div>
  )
}