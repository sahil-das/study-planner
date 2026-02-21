'use client'

import { useState, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { addTask, toggleTaskStatus, deleteTask } from '@/lib/actions/task.actions'
import { toast } from 'sonner'
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react'

const taskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters").max(100, "Title is too long"),
  priority: z.enum(['High', 'Medium', 'Low']),
  time_horizon: z.enum(['Daily', 'Weekly', 'Monthly', 'Long-Term']),
  deadline: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

export function AddTaskDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get today's date in YYYY-MM-DD format for the default value
  const today = new Date().toISOString().split('T')[0]

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      priority: 'Medium',
      time_horizon: 'Daily',
      deadline: today, // Auto-fills with today's date!
    },
  })

  const onSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true)
    try {
      await addTask({
        title: values.title,
        priority: values.priority,
        time_horizon: values.time_horizon,
        deadline: values.deadline || undefined,
      })
      toast.success("Target scheduled securely!")
      setOpen(false)
      form.reset({ ...form.getValues(), title: '' }) // Reset title but keep date/priority
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 w-4 h-4" /> Schedule Target
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule New Target</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Description</FormLabel>
                  <FormControl><Input placeholder="e.g. Read Chapter 4..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="time_horizon" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Planner Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Daily">Daily To-Do</SelectItem>
                        <SelectItem value="Weekly">Weekly Goal</SelectItem>
                        <SelectItem value="Monthly">Monthly Target</SelectItem>
                        <SelectItem value="Long-Term">Long-Term Vision</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField control={form.control} name="deadline" render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheduled Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {isSubmitting ? "Saving..." : "Save Target"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function TaskActions({ taskId, currentStatus }: { taskId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => startTransition(() => toggleTaskStatus(taskId, currentStatus))}
        disabled={isPending}
        className="text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
      >
        {currentStatus === 'Completed' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
      </button>
      
      <button 
        onClick={() => {
          if (confirm('Delete this target?')) {
            startTransition(() => deleteTask(taskId))
          }
        }}
        disabled={isPending}
        className="text-slate-400 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}