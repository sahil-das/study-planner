'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { addMockTest } from '@/lib/actions/mock-test.actions'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

const mockTestSchema = z.object({
  exam_name: z.string().min(2, "Exam name is required"),
  score: z.coerce.number().min(0, "Score cannot be negative"), // coerce converts string to number
  total_marks: z.coerce.number().min(1, "Total marks must be > 0"),
  accuracy: z.coerce.number().min(0).max(100, "Accuracy must be between 0-100"),
  time_taken_minutes: z.coerce.number().min(1, "Time must be > 0"),
})

type MockTestFormValues = z.infer<typeof mockTestSchema>

export function AddMockTestDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MockTestFormValues>({
    // FIX: Add 'as any' here to resolve the TypeScript coercion mismatch
    resolver: zodResolver(mockTestSchema) as any, 
    defaultValues: { exam_name: '', score: 0, total_marks: 100, accuracy: 80, time_taken_minutes: 60 },
  })

  const onSubmit = async (values: MockTestFormValues) => {
    if (values.score > values.total_marks) {
      form.setError('score', { message: 'Score cannot exceed total marks' })
      return
    }

    setIsSubmitting(true)
    try {
      await addMockTest(values)
      toast.success("Mock test logged successfully!")
      setOpen(false)
      form.reset()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-pink-600 hover:bg-pink-700 text-white">
          <Plus className="mr-2 w-4 h-4" /> Log Mock Test
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-slate-950 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Log Mock Test Result</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="exam_name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-slate-300">Exam / Mock Name</FormLabel>
                  <FormControl><Input placeholder="e.g. SSC CGL Tier 1 Mock #4" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="score" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-300">Your Score</FormLabel>
                    <FormControl><Input type="number" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="total_marks" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-300">Total Marks</FormLabel>
                    <FormControl><Input type="number" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="accuracy" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-300">Accuracy (%)</FormLabel>
                    <FormControl><Input type="number" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="time_taken_minutes" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-300">Time (mins)</FormLabel>
                    <FormControl><Input type="number" className="dark:bg-slate-900 dark:border-slate-700 dark:text-white" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                {isSubmitting ? "Saving..." : "Save Result"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}