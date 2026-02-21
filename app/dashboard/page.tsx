import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Flame, Clock, Target, CheckCircle2 } from 'lucide-react'
import { WeeklyChart } from '@/components/dashboard/weekly-chart'
import { TaskActions } from '@/components/dashboard/task-components'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const todayStr = new Date().toISOString().split('T')[0]
  const { data: todaySessions } = await supabase.from('study_sessions').select('duration_minutes').eq('user_id', user.id).eq('session_date', todayStr)
  const todayMinutes = todaySessions?.reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0

  const { data: userData } = await supabase.from('users').select('current_streak').eq('id', user.id).single()
  const currentStreak = userData?.current_streak || 0

  const { count: revisionsDue } = await supabase.from('revisions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_completed', false).lte('due_date', todayStr)

  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0]
  })

  const { data: weeklySessions } = await supabase.from('study_sessions').select('session_date, duration_minutes').eq('user_id', user.id).gte('session_date', past7Days[0]).lte('session_date', past7Days[6])

  const chartData = past7Days.map(dateStr => {
    const daySessions = weeklySessions?.filter(s => s.session_date === dateStr) || []
    const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration_minutes, 0)
    const dateObj = new Date(dateStr)
    return { date: dateObj.toLocaleDateString('en-US', { weekday: 'short' }), hours: Number((totalMinutes / 60).toFixed(1)) }
  })

  const { data: allDailyTasks } = await supabase.from('tasks').select('*').eq('user_id', user.id).eq('time_horizon', 'Daily').order('status', { ascending: false }).order('created_at', { ascending: false })

  const dailyTasks = allDailyTasks?.filter(task => {
    if (!task.deadline) return true;
    const taskDate = task.deadline.split('T')[0]
    if (taskDate > todayStr) return false; 
    if (taskDate < todayStr && task.status === 'Completed') return false; 
    return true; 
  }).slice(0, 6)

  const totalDaily = dailyTasks?.length || 0
  const completedDaily = dailyTasks?.filter(t => t.status === 'Completed').length || 0
  const progressPercentage = totalDaily === 0 ? 0 : Math.round((completedDaily / totalDaily) * 100)

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        {/* FIXED: Added dark:text-white */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your ExamPrep Command Center.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* FIXED: Added dark classes to Cards */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Studied Today</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</div></CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{currentStreak} Days</div></CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Revisions Due</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{revisionsDue || 0} Topics</div></CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Daily Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-900 dark:text-white">{progressPercentage}%</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-4">
        <WeeklyChart data={chartData} />
        
        <Card className="col-span-3 shadow-sm border-slate-200 dark:border-slate-800 dark:bg-slate-950 flex flex-col h-[400px]">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Today's Targets</CardTitle>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                {completedDaily}/{totalDaily} Done
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-slate-100 dark:bg-slate-800" />
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {dailyTasks?.map(task => {
              const isCompleted = task.status === 'Completed'
              const isOverdue = task.deadline && task.deadline.split('T')[0] < todayStr

              return (
                <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${isCompleted ? 'bg-slate-50 dark:bg-slate-900/50 border-transparent opacity-60' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm'}`}>
                  <div className="mt-0.5">
                    <TaskActions taskId={task.id} currentStatus={task.status} />
                  </div>
                  <div className="flex-1">
                    {/* FIXED: Added dark:text-slate-200 to tasks */}
                    <p className={`text-sm font-medium flex items-center gap-2 ${isCompleted ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {task.title}
                      {isOverdue && !isCompleted && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Overdue
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
            {(!dailyTasks || dailyTasks.length === 0) && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <p className="text-sm text-muted-foreground">No daily targets set.<br/>Go to Planner to schedule some!</p>
                <Link href="/dashboard/tasks" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Open Master Planner &rarr;
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}