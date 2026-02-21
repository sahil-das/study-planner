import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Target, Clock, Activity, Crosshair } from 'lucide-react'
import { AddMockTestDialog } from '@/components/dashboard/mock-test-components'

export default async function MockTestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: mockTests } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('user_id', user?.id || '')
    .order('created_at', { ascending: false })

  // Function to calculate percentage and determine color
  const getScoreDetails = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100)
    if (percentage >= 80) return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/50', pct: percentage }
    if (percentage >= 60) return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50', pct: percentage }
    return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50', pct: percentage }
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Mock Test Tracker</h1>
          <p className="text-muted-foreground">Log your scores and analyze your performance trend.</p>
        </div>
        <AddMockTestDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {mockTests?.map((test) => {
          const { color, bg, pct } = getScoreDetails(test.score, test.total_marks)
          const date = new Date(test.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

          return (
            <Card key={test.id} className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-md transition-all">
              <CardContent className="p-5">
                
                {/* Header: Exam Name & Date */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1">{test.exam_name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{date}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md border font-bold text-sm ${bg} ${color}`}>
                    {pct}%
                  </div>
                </div>

                {/* Main Score Display */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-black tracking-tighter ${color}`}>
                    {test.score}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    / {test.total_marks}
                  </span>
                </div>

                {/* Footer Stats: Accuracy & Time */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Accuracy</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{test.accuracy}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-semibold text-slate-500">Time Taken</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{test.time_taken_minutes}m</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          )
        })}
      </div>

      {(!mockTests || mockTests.length === 0) && (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 mt-8">
          <Target className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No mock tests logged yet</h3>
          <p className="text-muted-foreground mt-1">Take a test and log your score to start tracking performance!</p>
        </div>
      )}
    </div>
  )
}