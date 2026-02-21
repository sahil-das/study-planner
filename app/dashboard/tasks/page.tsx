import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddTaskDialog, TaskActions } from '@/components/dashboard/task-components'
import { Calendar, AlertCircle, Target, ListTodo, Map } from 'lucide-react'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user?.id || '').order('status', { ascending: false }).order('created_at', { ascending: false })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'
      case 'Medium': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900/50'
      case 'Low': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50'
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
    }
  }

  const renderTaskList = (filterHorizon: string, emptyMessage: string, EmptyIcon: any) => {
    const filteredTasks = tasks?.filter(t => t.time_horizon === filterHorizon) || []
    
    if (filteredTasks.length === 0) {
      return (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 mt-4">
          <EmptyIcon className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No targets set</h3>
          <p className="text-muted-foreground mt-1">{emptyMessage}</p>
        </div>
      )
    }

    return (
      <div className="space-y-3 mt-4">
        {filteredTasks.map((task) => {
          const isCompleted = task.status === 'Completed'
          return (
            <Card key={task.id} className={`transition-all border-slate-200 dark:border-slate-800 ${isCompleted ? 'opacity-60 bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-950 shadow-sm hover:shadow-md'}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <TaskActions taskId={task.id} currentStatus={task.status} />
                <div className="flex-1">
                  <h3 className={`font-medium ${isCompleted ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)} font-medium`}>
                      {task.priority}
                    </span>
                    {task.deadline && (
                      <span className="flex items-center text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Master Planner</h1>
          <p className="text-muted-foreground">Map out your long-term strategy and daily execution.</p>
        </div>
        <AddTaskDialog />
      </div>

      <Tabs defaultValue="Daily" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-900 p-1">
          <TabsTrigger value="Daily"><ListTodo className="w-4 h-4 mr-2 hidden sm:block" /> Daily</TabsTrigger>
          <TabsTrigger value="Weekly"><Calendar className="w-4 h-4 mr-2 hidden sm:block" /> Weekly</TabsTrigger>
          <TabsTrigger value="Monthly"><Target className="w-4 h-4 mr-2 hidden sm:block" /> Monthly</TabsTrigger>
          <TabsTrigger value="Long-Term"><Map className="w-4 h-4 mr-2 hidden sm:block" /> Long-Term</TabsTrigger>
        </TabsList>
        
        <TabsContent value="Daily">{renderTaskList('Daily', 'Add daily execution tasks like "Read Chapter 4".', ListTodo)}</TabsContent>
        <TabsContent value="Weekly">{renderTaskList('Weekly', 'Set weekly goals like "Complete Number System module".', Calendar)}</TabsContent>
        <TabsContent value="Monthly">{renderTaskList('Monthly', 'Set monthly milestones like "Finish entire QA syllabus".', Target)}</TabsContent>
        <TabsContent value="Long-Term">{renderTaskList('Long-Term', 'Set macro-goals like "Clear SSC CGL Tier 1".', Map)}</TabsContent>
      </Tabs>
    </div>
  )
}