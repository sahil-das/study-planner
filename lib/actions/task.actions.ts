'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Replace your existing addTask function with this:
export async function addTask(data: { title: string; priority: string; deadline?: string; time_horizon: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title: data.title,
    priority: data.priority,
    time_horizon: data.time_horizon, // <-- Added this
    deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/tasks')
  return { success: true }
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending'
  
  await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId)
  
  revalidatePath('/dashboard/tasks')
  revalidatePath('/dashboard') // <-- Add this line!
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  await supabase.from('tasks').delete().eq('id', taskId)
  revalidatePath('/dashboard/tasks')
}