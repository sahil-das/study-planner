'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMockTest(data: {
  exam_name: string
  score: number
  total_marks: number
  accuracy: number
  time_taken_minutes: number
}) {
  const supabase = await createClient() // Next.js 15 safe!
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('mock_tests').insert({
    user_id: user.id,
    exam_name: data.exam_name,
    score: data.score,
    total_marks: data.total_marks,
    accuracy: data.accuracy,
    time_taken_minutes: data.time_taken_minutes,
  })

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard/mock-tests')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteMockTest(id: string) {
  const supabase = await createClient()
  await supabase.from('mock_tests').delete().eq('id', id)
  revalidatePath('/dashboard/mock-tests')
  revalidatePath('/dashboard')
}